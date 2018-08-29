import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const mediaGroup: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(`!${n.attrs.id}|thumbnail!`);
  });

  return result.join('\n');
};
