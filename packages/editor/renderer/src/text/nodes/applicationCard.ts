import { Node as PMNode } from 'prosemirror-model';
import { NodeReducer } from './';

const applicationCard: NodeReducer = (node: PMNode) => {
  return `${node.attrs.text || node.attrs.title.text}`;
};

export default applicationCard;
