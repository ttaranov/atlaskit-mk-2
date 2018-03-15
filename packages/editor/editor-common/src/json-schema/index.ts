/* tslint:disable:no-bitwise */
import * as ts from 'typescript';

import JSONSchemaNode, {
  SchemaNode,
  StringSchemaNode,
  ArraySchemaNode,
  ObjectSchemaNode,
  EnumSchemaNode,
  PrimitiveSchemaNode,
  RefSchemaNode,
  EmptySchemaNode,
  AnyOfSchemaNode,
  AllOfSchemaNode,
} from './json-schema-nodes';

// Assuming that the last param will be a file, can be replaced with something like yargs in future
const file = process.argv[process.argv.length - 1];
const files = [file];

const program = ts.createProgram(files, { jsx: ts.JsxEmit.React });
const checker = program.getTypeChecker();
const typeIdToDefName: Map<number, string> = new Map();

const jsonSchema = new JSONSchemaNode(
  'draft-04',
  'Schema for Atlassian Editor documents.',
  'doc_node',
);

let ticks = 0;
program.getSourceFiles().forEach(walk);

waitForTicks()
  .then(() => {
    /* tslint:disable-next-line:no-console */
    console.log(JSON.stringify(jsonSchema, null, 2));
  })
  .catch(err => {
    /* tslint:disable-next-line:no-console */
    console.error(err);
  });

function waitForTicks() {
  return new Promise(resolve => {
    const waitForTick = () => {
      process.nextTick(() => {
        ticks--;
        ticks > 0 ? waitForTick() : resolve();
      });
    };
    waitForTick();
  });
}

function walk(node: ts.Node) {
  if (isSourceFile(node)) {
    node.forEachChild(walk);
  } else if (isInterfaceDeclaration(node) || isTypeAliasDeclaration(node)) {
    const symbol: ts.Symbol = (node as any).symbol;
    const { name, ...rest } = getTags(symbol.getJsDocTags());
    if (name) {
      if (jsonSchema.hasDefinition(name)) {
        throw new Error(`Duplicate definition for ${name}`);
      }
      const type = checker.getTypeAtLocation(node);
      jsonSchema.addDefinition(name, getSchemaNodeFromType(type, rest));
      typeIdToDefName.set((type as any).id, name);
    }
  } else {
    // If in future we need support for other nodes, this will help to debug
    // console.log(syntaxKindToName(node.kind));
    // node.forEachChild(walk);
  }
}

function getSchemaNodeFromType(type: ts.Type, validators = {}): SchemaNode {
  // Found a $ref
  // TODO: Fix any
  if (typeIdToDefName.has((type as any).id)) {
    return new RefSchemaNode(
      `#/definitions/${typeIdToDefName.get((type as any).id)!}`,
    );
  } else if (isStringType(type)) {
    return new StringSchemaNode(validators);
  } else if (isBooleanType(type)) {
    return new PrimitiveSchemaNode('boolean');
  } else if (isNumberType(type)) {
    return new PrimitiveSchemaNode('number', validators);
  } else if (isUnionType(type)) {
    const isEnum = type.types.every(t => isStringLiteralType(t));
    if (isEnum) {
      return new EnumSchemaNode(
        type.types.map(t => (t as ts.LiteralType).value),
      );
    } else {
      return new AnyOfSchemaNode(type.types.map(t => getSchemaNodeFromType(t)));
    }
  } else if (isIntersectionType(type)) {
    return new AllOfSchemaNode(
      type.types.map(t =>
        getSchemaNodeFromType(t, getTags(t.getSymbol().getJsDocTags())),
      ),
    );
  } else if (isArrayType(type)) {
    const node = new ArraySchemaNode([], validators);
    // [X, X | Y]
    if (!type.typeArguments) {
      const types = type.getNumberIndexType();

      // Look for all indexed type
      let i = 0;
      let prop: ts.Symbol;
      while ((prop = type.getProperty(`${i}`))) {
        node.push(getSchemaNodeFromType(getTypeFromSymbol(prop)));
        i++;
      }

      /**
       * This will always be a Union type because it's not possible to write something like
       * interface X extends Array<X> {
       *  0: X;
       * }
       */
      if (isUnionType(types)) {
        node.push(getSchemaNodeFromType(types));
      }
    } else {
      const types = type.typeArguments;
      node.push(
        types.length === 1 && isAnyType(types[0]) // Array<any>
          ? []
          : types.map(t => getSchemaNodeFromType(t)),
      );
    }
    return node;
  } else if (isObjectType(type)) {
    const obj = new ObjectSchemaNode(
      {},
      { additionalProperties: false, ...validators },
    );
    // Use node's queue to prevent circular dependency
    process.nextTick(() => {
      ticks++;
      const props = checker.getPropertiesOfType(type);
      props.forEach(prop => {
        const name = prop.getName();
        // Drop private properties __fileName, __fileType, etc
        if ((name[0] !== '_' || name[1] !== '_') && prop.valueDeclaration) {
          const propType = getTypeFromSymbol(prop);
          const isRequired = (prop.getFlags() & ts.SymbolFlags.Optional) === 0;
          const validators = getTags(prop.getJsDocTags());
          obj.addProperty(
            name,
            getSchemaNodeFromType(propType, validators),
            isRequired,
          );
        }
      });
    });
    return obj;
  } else if (isLiteralType(type)) {
    // Using ConstSchemaNode doesn't pass validation
    return new EnumSchemaNode(extractLiteralValue(type));
  } else if (isNonPrimitiveType(type)) {
    // object
    return new EmptySchemaNode();
  }

  throw new Error(`TODO: ${checker.typeToString(type)} to be defined`);
}

type TagInfo = { name: string };

function getTags(tagInfo: ts.JSDocTagInfo[]): TagInfo {
  return tagInfo.reduce(
    (obj, { name, text = '' }) => {
      // TODO: Fix any
      let val: any = text;
      if (/^\d+$/.test(text)) {
        // Number
        val = +text;
      } else if (text[0] === '"') {
        // " wrapped string
        val = JSON.parse(text);
      } else if (text === 'true') {
        val = true;
      } else if (text === 'false') {
        val = false;
      }
      // TODO: Fix any
      (obj as any)[name] = val;
      return obj;
    },
    {} as TagInfo,
  );
}

type PrimitiveType = number | boolean | string;

function extractLiteralValue(typ: ts.Type): PrimitiveType {
  if (typ.flags & ts.TypeFlags.EnumLiteral) {
    let str = String((typ as ts.LiteralType).value);
    let num = parseFloat(str);
    return isNaN(num) ? str : num;
  } else if (typ.flags & ts.TypeFlags.StringLiteral) {
    return (typ as ts.LiteralType).value;
  } else if (typ.flags & ts.TypeFlags.NumberLiteral) {
    return (typ as ts.LiteralType).value;
  } else if (typ.flags & ts.TypeFlags.BooleanLiteral) {
    // TODO: Fix any
    return (typ as any).intrinsicName === 'true';
  }
  throw new Error(`Couldn't parse in extractLiteralValue`);
}

function getTypeFromSymbol(symbol: ts.Symbol) {
  return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
}

function isSourceFile(node: ts.Node): node is ts.SourceFile {
  return node.kind === ts.SyntaxKind.SourceFile;
}

function isInterfaceDeclaration(
  node: ts.Node,
): node is ts.InterfaceDeclaration {
  return node.kind === ts.SyntaxKind.InterfaceDeclaration;
}

function isTypeAliasDeclaration(
  node: ts.Node | ts.Declaration,
): node is ts.TypeAliasDeclaration {
  return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
}

function isStringType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.String) > 0;
}

function isBooleanType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.Boolean) > 0;
}

function isNumberType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.Number) > 0;
}

function isUnionType(type: ts.Type): type is ts.UnionType {
  return (type.flags & ts.TypeFlags.Union) > 0;
}

function isIntersectionType(type: ts.Type): type is ts.IntersectionType {
  return (type.flags & ts.TypeFlags.Intersection) > 0;
}

function isArrayType(type: ts.Type): type is ts.TypeReference {
  /**
   * Here instead of checking `type.getSymbol().getName() === 'Array'`
   * we are checking `length`.
   * @see https://blogs.msdn.microsoft.com/typescript/2018/01/17/announcing-typescript-2-7-rc/#fixed-length-tuples
   */
  return (
    isObjectType(type) &&
    (type.objectFlags & ts.ObjectFlags.Reference) > 0 &&
    !!type.getProperty('length')
  );
}

function isObjectType(type: ts.Type): type is ts.ObjectType {
  return (type.flags & ts.TypeFlags.Object) > 0;
}

function isStringLiteralType(type: ts.Type): type is ts.LiteralType {
  return (type.flags & ts.TypeFlags.StringLiteral) > 0;
}

function isLiteralType(type: ts.Type): type is ts.LiteralType {
  return (type.flags & ts.TypeFlags.Literal) > 0;
}

function isNonPrimitiveType(type: ts.Type): type is ts.LiteralType {
  return (type.flags & ts.TypeFlags.NonPrimitive) > 0;
}

function isAnyType(type: ts.Type): type is ts.Type {
  return (type.flags & ts.TypeFlags.Any) > 0;
}

/*
function syntaxKindToName(kind: ts.SyntaxKind) {
  return ts.SyntaxKind[kind];
}
*/
