import { traverse, ADFNode } from './traverse';

export function filter(
  adf: ADFNode,
  callback: (node: ADFNode) => boolean,
): Array<ADFNode> {
  const result: Array<ADFNode> = [];

  traverse(adf, {
    any: node => {
      if (callback(node)) {
        result.push(node);
      }
    },
  });

  return result;
}
