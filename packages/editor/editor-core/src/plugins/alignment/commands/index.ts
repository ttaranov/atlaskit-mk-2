import { Command } from '../../../types';
import { findParentNode } from 'prosemirror-utils';
import { AlignmentState } from '../pm-plugins/main';
import { isAlignmentAllowed } from '../utils';

const allowedBlocksForAlignment = ['paragraph', 'heading'];

export function changeAlignment(align: AlignmentState): Command {
  return (state, dispatch) => {
    const { selection, tr } = state;
    const nodesToAlign = [] as any;

    /** Check if any node encountered in the selection is align-able */
    state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
      const resolvedPos = state.doc.resolve(pos);
      if (isAlignmentAllowed(state, node, resolvedPos)) {
        nodesToAlign.push({
          node,
          depth: resolvedPos.depth,
          pos,
        });
      }
    });

    const node = findParentNode(node =>
      allowedBlocksForAlignment.includes(node.type.name),
    )(state.selection);

    if (!node) {
      return false;
    }

    nodesToAlign.forEach(node => {
      tr.setNodeMarkup(node.pos, undefined, node.attrs, [
        state.schema.marks.alignment.create({ align }),
      ]);
    });

    dispatch(tr);

    return true;
  };
}
