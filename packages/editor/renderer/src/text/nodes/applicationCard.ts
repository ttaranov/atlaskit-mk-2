import { Node as PMNode, Schema } from 'prosemirror-model';
import { ReducedNode } from './';

export default function applicationCard(
  node: PMNode,
  schema: Schema,
): ReducedNode {
  return {
    text: `${node.attrs.text || node.attrs.title.text}`,
  };
}
