import { merge } from 'lodash';
import { JSONSchema4 } from 'json-schema';
import { SchemaNode, ObjectNode, isTypedNode } from './types';

export const isSubNodeRequired = (node: ObjectNode, property: string) => {
  return node.required && node.required.indexOf(property) !== -1;
};

export const mergeNodes = (left: SchemaNode, right: SchemaNode): SchemaNode => {
  if (Object.keys(left).length === 0) {
    return right;
  }
  if (
    !isTypedNode(left) ||
    !isTypedNode(right) ||
    left.type !== 'object' ||
    left.type !== right.type
  ) {
    throw new Error('Could not merge non-object nodes');
  }
  return {
    ...left,
    properties: merge(left.properties, right.properties),
    required:
      left.required && right.required
        ? [...left.required, ...right.required]
        : left.required || right.required || false,
  };
};

export const transformSchema = (document: JSONSchema4): JSONSchema4 => {
  if (
    document.$ref &&
    document.$ref === '#/definitions/doc_node' &&
    document.definitions &&
    document.definitions['doc_node']
  ) {
    return {
      ...document,
      $ref: undefined,
      ...document.definitions['doc_node'],
    };
  }
  throw new Error('Unexpected format of the schema: no doc_node spec');
};

/**
 * Object.assign is current not supported by our TS environment.
 */
export const basicObjectAssign = (target: object, source?: object) => {
  if (source) {
    Object.keys(source).forEach(key => {
      target[key] = source[key];
    });
  }
  return target;
};
