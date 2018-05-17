import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

import { listItem } from './listItem';

export const orderedList: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(item => {
    result.push(listItem(item, '#'));
  });
  return result.join('\n');
};
