import * as nodes from './nodes';
import * as _marks from './marks';

export const inlineNodes = new Set(
  Object.keys(nodes).filter(key => nodes[key] && nodes[key].group === 'inline'),
);

export const blockNodes = new Set(
  Object.keys(nodes).filter(key => nodes[key] && nodes[key].group === 'block'),
);

export const marks = new Set(Object.keys(_marks));
