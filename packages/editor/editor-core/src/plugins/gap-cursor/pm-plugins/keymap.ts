import { keydownHandler } from 'prosemirror-keymap';
import { EditorView } from 'prosemirror-view';
import {
  EditorState,
  Transaction,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { removeNodeBefore } from 'prosemirror-utils';
import { GapCursorSelection, Side } from '../selection';
import { isIgnored } from '../utils';
import { Command } from '../../../types';

function arrow(dir: number) {
  return function(
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view: EditorView,
  ) {
    let side = dir === -1 ? Side.LEFT : Side.RIGHT;

    const { selection, tr } = state;
    let $pos = side === Side.RIGHT ? selection.$to : selection.$from;
    let mustMove = selection.empty;

    // start from text selection
    if (selection instanceof TextSelection) {
      if (
        view &&
        !view.endOfTextblock(side === Side.RIGHT ? 'right' : 'left')
      ) {
        return false;
      }
      mustMove = false;
      $pos = state.doc.resolve(
        side === Side.RIGHT ? $pos.after() : $pos.before(),
      );
    }

    let nextSelection;
    const { nodeAfter, nodeBefore } = $pos;

    // when jumping between block nodes at the same depth, we need to reverse cursor without changing ProseMirror position
    if (
      selection instanceof GapCursorSelection &&
      // next node allow gap cursor position
      (side === Side.RIGHT
        ? nodeAfter && !isIgnored(nodeAfter)
        : nodeBefore && !isIgnored(nodeBefore)) &&
      // gap cursor changes block node
      ((side === Side.RIGHT && selection.side === Side.RIGHT) ||
        (side === Side.LEFT && selection.side === Side.LEFT))
    ) {
      // reverse cursor position
      nextSelection = new GapCursorSelection(
        $pos,
        side === Side.RIGHT ? Side.LEFT : Side.RIGHT,
      );
    } else {
      nextSelection = GapCursorSelection.findFrom($pos, dir, mustMove);
      if (!nextSelection) {
        return false;
      }
      const { nodeBefore, nodeAfter } = nextSelection.$from;
      if (
        side === Side.RIGHT
          ? !nodeBefore || isIgnored(nodeBefore)
          : !nodeAfter || isIgnored(nodeAfter)
      ) {
        // reverse cursor position
        nextSelection = new GapCursorSelection(
          nextSelection.$from,
          side === Side.RIGHT ? Side.LEFT : Side.RIGHT,
        );
      }
    }

    dispatch(tr.setSelection(nextSelection).scrollIntoView());
    return true;
  };
}

const deleteNode = (direction: 'before' | 'after'): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (state.selection instanceof GapCursorSelection) {
    const { $from } = state.selection;
    let { tr } = state;
    if (direction === 'before') {
      tr = removeNodeBefore(state.tr);
    } else if ($from.nodeAfter) {
      tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
    }
    dispatch(
      tr
        .setSelection(
          Selection.near(
            tr.doc.resolve(tr.mapping.map(state.selection.$from.pos)),
          ),
        )
        .scrollIntoView(),
    );
    return true;
  }
  return false;
};

export const handleKeyDown = keydownHandler({
  ArrowLeft: arrow(-1),
  ArrowRight: arrow(1),

  // default PM's Backspace doesn't handle removing block nodes when cursor is after it
  Backspace: deleteNode('before'),
  // handle Delete key (remove node before the cursor)
  Delete: deleteNode('after'),
});
