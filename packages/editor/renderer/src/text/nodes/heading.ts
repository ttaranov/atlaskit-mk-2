import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduceTree } from '../utils';
import { ReducedNode } from './';

export default function heading(node: PMNode, schema: Schema): ReducedNode {
  if (node.childCount) {
    return {
      content: reduceTree(node.content, schema),
    };
  }
  return {};
}
