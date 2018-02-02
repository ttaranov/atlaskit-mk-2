import { log } from 'util';

// @flow

const converters = {};

converters.boolean = type => type.value.toString();
converters.number = type => type.value.toString();
converters.string = type => `"${type.value.toString()}"`;
converters.custom = type => type.value.toString();
converters.any = type => type.value.toString();
converters.void = type => type.value.toString();
converters.mixed = type => type.value.toString();
converters.null = () => 'null';

converters.id = type => {
  if (type.resolvedVal) {
    return convert(type.resolvedVal);
  }
  return type.name;
};

converters.JSXMemberExpression = type => {
  return `${convert(type.object)}.${convert(type.property)}`;
};
converters.JSXExpressionContainer = type => {
  return `{ ${convert(type.expression)} }`;
};

converters.JSXElement = type => {
  return `<${convert(type.value.name)} ${type.value.attributes.map(attribute =>
    convert(attribute),
  )} />`;
};

converters.JSXIdentifier = type => {
  return `${type.value}`;
};

converters.JSXAttribute = type => {
  return `${convert(type.name)}= ${convert(type.value)}`;
};

converters.binary = type => {
  const left = convert(type.left);
  const right = convert(type.right);
  return `${left} ${type.operator} ${right}`;
};

converters.function = type => {
  return convert(type.id) || type.referenceIdName || 'function';
};

converters.array = type => {
  return `[${type.elements.map(p => p.value).join(', ')}]`;
};

converters.object = type => {
  return `{ ${type.members
    .map(m => `${convert(m.key)}: ${m.value.defaultValue || convert(m.value)}`)
    .join(', ')} }`;
};

converters.memberExpression = type => {
  const property = type.property.name;
  if (type.object.kind === 'object') {
    const mem =
      type.object.kind === 'object' &&
      type.object.members.find(m => m.key.name === property);
    if (mem) {
      // we should have a convertToStringFunction that is called here, as we cannot
      // really assume the value type.
      return convert(mem.value);
    }
  } else if (type.object.kind === 'call' || type.object.kind === 'new') {
    const convertedObject = convert(type.object);
    if (convertedObject) {
      return `${convertedObject}.${property}`;
    }
  }
  return property;
};

function convertCall(type) {
  let argsString = `${type.args.map(convert).join(', ')}`;
  if (argsString.length > 30) {
    argsString = '...';
  }
  return `${convert(type.callee)}(${argsString})`;
}

converters.call = type => {
  return convertCall(type);
};

converters.new = type => {
  const callString = convertCall(type);

  return `new ${callString}`;
};

converters.external = type => {
  if (type.importKind === 'value') {
    return `${type.moduleSpecifier}.${type.name}`;
  }
  // eslint-disable-next-line no-console
  console.warn('could not convert external', type);
  return '';
};

converters.variable = type => {
  const val = type.declarations[type.declarations.length - 1];
  if (val.value) {
    return convert(val.value);
  }
  return convert(val.id);
};

converters.templateExpression = ({ tag }) => {
  return `${convert(tag)}`;
};

export default function convert(type: { kind: string }) {
  const converter = converters[type.kind];
  if (!converter) {
    // eslint-disable-next-line no-console
    console.warn('could not find converter for', type.kind);
  } else {
    return converter(type);
  }
  return '';
}
