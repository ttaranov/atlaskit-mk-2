import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '..';

export const table: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(tableRow(n));
  });

  return result.join('\n');
};

const tableRow: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  let separator: string = '|';
  node.forEach(n => {
    if (n.type.name === 'tableHeader') {
      separator = '||';
    }
    result.push(tableCell(n));
  });

  return `${separator}${result.join(`${separator}`)}${separator}`;
};

const tableCell: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(encode(n));
  });

  return result.join('\n');
};
