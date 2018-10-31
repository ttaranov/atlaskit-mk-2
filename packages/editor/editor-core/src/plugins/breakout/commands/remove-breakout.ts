import { findParentNode } from 'prosemirror-utils';
import { Command } from '../../../types';

export function removeBreakout(): Command {
  return (state, dispatch) => {
    const node = findParentNode(node => node.type.name === 'codeBlock')(
      state.selection,
    );

    if (!node) {
      return false;
    }

    const marks = node.node.marks.filter(m => m.type.name !== 'breakout');
    dispatch(
      state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, marks),
    );
    return true;
  };
}
