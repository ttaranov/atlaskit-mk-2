import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const mention: NodeEncoder = (node: PMNode): string => {
  return `[~${node.attrs.id}]`;
};
