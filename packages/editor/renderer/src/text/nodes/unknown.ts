import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduceTree } from '../utils';
import { ReducedNode } from './';

const getText = (node: PMNode): string => {
  return (
    node.text ||
    node.attrs.text ||
    node.attrs.shortName ||
    `[${node.type.name}]`
  );
};

export default function unknown(node: PMNode, schema: Schema): ReducedNode {
  if (node.childCount) {
    return {
      content: reduceTree(node.content, schema),
    };
  }
  return { text: getText(node) };
}
