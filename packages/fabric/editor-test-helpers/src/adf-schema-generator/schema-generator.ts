import {
  AllOfNode,
  AnyOfNode,
  isAllOfNode,
  isAnyOfNode,
  isEnumNode,
  isTypedNode,
  SchemaNode,
  TypedNode,
} from './types';
import * as Random from './random-utils';
import { Stack } from './stack';
import { isSubNodeRequired, mergeNodes, basicObjectAssign } from './utils';

export default function* generateADF(
  schema: SchemaNode,
  { traversalLikelihood = 0.5, maxArrayLength = 3 },
) {
  const stack = new Stack();

  /**
   * Called to decide whether or not to traverse further than required.
   * i.e. should explore optional node / should expand as many children as possible
   */
  const shouldExploreNode = () => {
    return Random.decimalFromZeroToOne() < traversalLikelihood;
  };

  /**
   * Given a JSON Schema Node in the form
   * `{ type: 'string', ... }`
   * For primitive values, it will return the value
   * For array nodes, it will return the array with the references of it's future children
   * For object nodes, it will return a reference to the future object
   */
  const generateForNodeType = (node: TypedNode) => {
    const assertNever = (x: never): never => {
      throw new Error('Unexpected object: ' + x);
    };

    switch (node.type) {
      case 'string':
        return node.pattern
          ? Random.stringFromPattern(node.pattern)
          : Random.string();
      case 'boolean':
        return Random.boolean();
      case 'number':
        return Random.floating(node.minimum, node.maximum);
      case 'array':
        const min = node.minItems != null ? node.minItems : 0;
        const max = node.maxItems != null ? node.maxItems : maxArrayLength;
        const length = Random.naturalNumber(
          min,
          shouldExploreNode() ? max : min,
        );
        return Array.from(Array(length), () => generateForNode(node.items));
      case 'object':
        const toBeTraversed = {};
        if (node.properties) {
          Object.keys(node.properties)
            .filter(
              property =>
                isSubNodeRequired(node, property) || shouldExploreNode(),
            )
            .forEach(property =>
              stack.push({
                type: 'ASSIGN',
                ancestor: toBeTraversed,
                property,
                node: node.properties[property],
              }),
            );
        }
        return toBeTraversed;
      default:
        return assertNever(node);
    }
  };

  /**
   * Given a JSON Schema node in the form
   * `{ anyOf: [...], ... }` or `{ allOf: [...], ... }`
   * For anyOf & allOf nodes, it will return a reference to the future value
   */
  const generateForNodeCombinations = (node: AnyOfNode | AllOfNode) => {
    if (isAnyOfNode(node)) {
      const subNode = Random.itemFromList(node.anyOf);
      return generateForNode(subNode);
    }
    if (isAllOfNode(node)) {
      const mergedSubNodes = node.allOf.reduce(
        (acc, curr) => mergeNodes(acc, curr),
        {} as any,
      );
      return generateForNode(mergedSubNodes);
    }
    throw new Error('Could not generate fake data for node with combinations');
  };

  /**
   * Delegate to the appropriate generator based on the JSON schema structure
   */
  const generateForNode = (node: SchemaNode): object | undefined => {
    if (isTypedNode(node)) {
      return generateForNodeType(node);
    }
    if (isAllOfNode(node) || isAnyOfNode(node)) {
      return generateForNodeCombinations(node);
    }
    if (isEnumNode(node)) {
      return Random.itemFromList(node.enum as any[]);
    }
    if (Object.keys(node).length === 0) {
      return undefined;
    }
    throw new Error('Could not handle node with unknown shape');
  };

  while (true) {
    const doc = generateForNode(schema);
    while (!stack.isEmpty()) {
      const action = stack.pop();
      if (action && action.type === 'ASSIGN') {
        action.ancestor[action.property] = generateForNode(action.node);
      }
      if (action && action.type === 'MERGE') {
        basicObjectAssign(action.accumulator, generateForNode(action.node));
      }
    }
    yield doc || {};
  }
}
