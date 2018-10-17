import { Command } from '../../../types';
import { findParentNode } from 'prosemirror-utils';

export type BreakoutMode = 'wide' | 'full-width';

export function setBreakoutMode(mode: BreakoutMode): Command {
  return (state, dispatch) => {
    const node = findParentNode(node => node.type.name === 'codeBlock')(
      state.selection,
    );

    if (!node) {
      return false;
    }

    // const breakoutMark = node.node.marks.find(m => m.type.name === 'breakout');
    dispatch(
      state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, [
        state.schema.marks.breakout.create({ mode }),
      ]),
    );

    return true;
  };
}
