import { Node as PMNode, Schema } from 'prosemirror-model';
import { ReducedNode } from './';

export default function table(node: PMNode, schema: Schema): ReducedNode {
  return {
    text: '{table}',
  };
}
