import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduceTree } from '../utils';
import { ReducedNode } from './';

export default function panel(node: PMNode, schema: Schema): ReducedNode {
  return {
    content: reduceTree(node.content, schema),
    text: `[${node.attrs.panelType}] `,
  };
}
