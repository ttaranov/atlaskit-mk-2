import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '../';

export const doc: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];

  node.forEach(n => {
    result.push(encode(n));
  });

  return result.join('\n\n');
};
