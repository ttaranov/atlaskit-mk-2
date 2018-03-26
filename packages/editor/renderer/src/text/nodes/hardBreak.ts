import { Node as PMNode } from 'prosemirror-model';
import { ReducedNode } from './';

export default function hardBreak(node: PMNode): ReducedNode {
  return {
    text: '\n',
  };
}
