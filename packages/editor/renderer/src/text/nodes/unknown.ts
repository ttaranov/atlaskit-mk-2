import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduce, NodeReducer } from './';

export const getText = (node: PMNode): string => {
  return (
    node.text ||
    node.attrs.text ||
    node.attrs.shortName ||
    `[${node.type.name}]`
  );
};

const unknown: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];

  node.forEach(n => {
    result.push(reduce(n, schema));
  });

  if (result.length > 0) {
    return result.join('');
  }
  return getText(node);
};

export default unknown;
