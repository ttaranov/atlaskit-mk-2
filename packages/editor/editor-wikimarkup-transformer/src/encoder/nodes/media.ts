import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const media: NodeEncoder = (node: PMNode): string => {
  return `!${node.attrs.id}|thumbnail!`;
};
