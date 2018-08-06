import { traverse, ADFNode } from './traverse';

export function map<T = any>(
  adf: ADFNode,
  callback: (node: ADFNode) => T,
): Array<T> {
  const result: Array<T> = [];

  traverse(adf, {
    any: node => {
      result.push(callback(node));
    },
  });

  return result;
}
