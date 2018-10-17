import { Command } from '../../../types';
import { findParentNode } from 'prosemirror-utils';

export function removeBreakout(): Command {
  return (state, dispatch) => {
    const node = findParentNode(node => node.type.name === 'codeBlock')(
      state.selection,
    );

    if (!node) {
      return false;
    }

    dispatch(
      state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, []),
    );
    return true;
  };
}
