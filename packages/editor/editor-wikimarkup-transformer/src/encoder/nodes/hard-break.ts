import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const hardBreak: NodeEncoder = (node: PMNode): string => {
  return '\n';
};
