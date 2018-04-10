import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduceTree } from '../utils';
import { ReducedNode } from './';

export default function orderedList(node: PMNode, schema: Schema): ReducedNode {
  if (node.childCount) {
    return {
      content: reduceTree(node.content, schema).map((n, i) => {
        n.text = `${i + 1}. `;
        return n;
      }),
    };
  }
  return {};
}
