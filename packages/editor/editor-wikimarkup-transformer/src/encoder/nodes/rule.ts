import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const rule: NodeEncoder = (node: PMNode): string => {
  return '----';
};
