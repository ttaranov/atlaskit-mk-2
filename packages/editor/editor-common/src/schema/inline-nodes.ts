import * as nodes from './nodes';

export const inlineNodes = new Set(
  Object.keys(nodes).filter(key => nodes[key] && nodes[key].group === 'inline'),
);
