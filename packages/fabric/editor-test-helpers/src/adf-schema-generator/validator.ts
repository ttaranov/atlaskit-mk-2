import {
  SchemaNode,
  isTypedNode,
  isAnyOfNode,
  isAllOfNode,
  isEnumNode,
} from './types';
import { mergeNodes } from './utils';

const assertOnlyFields = (
  node: object,
  requiredFields: string[],
  optionalFields: string[] = [],
) => {
  Object.keys(node)
    .filter(field => optionalFields.indexOf(field) === -1) // Filter out optional fields
    .filter(
      field => ['additionalProperties', 'definitions'].indexOf(field) === -1,
    ) // Always ignore these
    .forEach(field => {
      if (requiredFields.indexOf(field) === -1) {
        throw new Error(`Unexpected field in schema: ${field}`);
      }
    });
};

const assertNodeIsValid = (node: SchemaNode) => {
  const assertNever = (x: never): never => {
    throw new Error('Unexpected object: ' + x);
  };
  if (isTypedNode(node)) {
    switch (node.type) {
      case 'string':
        assertOnlyFields(node, ['type'], ['pattern', 'minLength', 'maxLength']);
        break;
      case 'boolean':
        assertOnlyFields(node, ['type']);
        break;
      case 'number':
        assertOnlyFields(node, ['type'], ['minimum', 'maximum']);
        break;
      case 'array':
        assertOnlyFields(node, ['type'], ['minItems', 'maxItems', 'items']);
        break;
      case 'object':
        assertOnlyFields(node, ['type'], ['properties', 'required']);
        break;
      default:
        assertNever(node);
    }
  } else if (isAnyOfNode(node)) {
    assertOnlyFields(node, ['anyOf']);
  } else if (isAllOfNode(node)) {
    assertOnlyFields(node, ['allOf']);
  } else if (isEnumNode(node)) {
    assertOnlyFields(node, ['enum']);
  } else {
    assertOnlyFields(node, []);
  }
};

/**
 * Ensure that the schema confirms to the assumptions made by the
 * iteration algorithm.
 */
export const assertSchemaIsValid = (schema: SchemaNode) => {
  const seen: Set<SchemaNode> = new Set();
  const toExplore = [schema];
  while (toExplore.length > 0) {
    const current = toExplore.pop()!;
    if (!seen.has(current)) {
      seen.add(current);
      assertNodeIsValid(current);

      if (isTypedNode(current)) {
        if (current.type === 'object') {
          Object.keys(current.properties).forEach(property => {
            toExplore.push(current.properties[property]);
          });
        } else if (current.type === 'array') {
          if (current.items) {
            toExplore.push(current.items);
          }
        }
      } else if (isAllOfNode(current)) {
        toExplore.push(current.allOf.reduce(mergeNodes));
      } else if (isAnyOfNode(current)) {
        current.anyOf.forEach(node => toExplore.push(node));
      }
    }
  }
  return schema;
};
