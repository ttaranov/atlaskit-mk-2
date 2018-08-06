import { traverse, ADFNode } from './traverse';

export function reduce<T = any>(
  adf: ADFNode,
  callback: (accumulator: T, node: ADFNode) => T,
  initial: T,
): T {
  let result = initial;

  traverse(adf, {
    any: node => {
      result = callback(result, node);
    },
  });

  return result;
}
