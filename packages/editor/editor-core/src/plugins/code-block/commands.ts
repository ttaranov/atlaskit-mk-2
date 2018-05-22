import { Command } from '../../types';

export function setNodeAttributes(pos: number, attributes: object): Command {
  return function(state, dispatch) {
    dispatch(state.tr.setNodeMarkup(pos, undefined, attributes));
    return true;
  };
}

export function deleteNodeAtPos(pos: number): Command {
  return function(state, dispatch) {
    const node = state.doc.nodeAt(pos);
    if (node) {
      dispatch(state.tr.delete(pos, pos + node.nodeSize));
      return true;
    }
    return false;
  };
}
