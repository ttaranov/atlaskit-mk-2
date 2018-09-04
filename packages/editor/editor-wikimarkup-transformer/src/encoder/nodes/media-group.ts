import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { media } from './media';

export const mediaGroup: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(media(n));
  });

  return result.join('\n');
};
