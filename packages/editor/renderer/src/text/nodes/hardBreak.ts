import { Node as PMNode } from 'prosemirror-model';
import { NodeReducer } from './';

const hardBreak: NodeReducer = (node: PMNode) => {
  return '\n';
};

export default hardBreak;
