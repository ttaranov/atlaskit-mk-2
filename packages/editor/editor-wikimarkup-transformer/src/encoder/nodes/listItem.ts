import { Node as PMNode } from 'prosemirror-model';
import { encode } from '..';

import { paragraph } from './paragraph';

export const listItem = (node: PMNode, prefix: string): string => {
  const result: string[] = [];
  let paragraphBuffer: string[] = [];
  node.forEach((n, offset, index) => {
    switch (n.type.name) {
      case 'paragraph': {
        paragraphBuffer.push(paragraph(n));
        break;
      }
      case 'bulletList':
      case 'orderedList': {
        if (paragraphBuffer.length) {
          result.push(`${prefix} ${paragraphBuffer.join('\n')}`);
          paragraphBuffer = [];
        }
        const nestedList = encode(n)
          .split('\n')
          .map(line => {
            if (['#', '*'].indexOf(line.substr(0, 1)) !== -1) {
              return `${prefix}${line}`;
            }
            return line;
          })
          .join('\n');
        result.push(nestedList);
        break;
      }
      default:
    }
  });
  if (paragraphBuffer.length) {
    result.push(`${prefix} ${paragraphBuffer.join('\n')}`);
  }
  return result.join('\n');
};
