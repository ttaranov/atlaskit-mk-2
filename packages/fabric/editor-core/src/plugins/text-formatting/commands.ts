import { EditorState, Transaction, TextSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { removeIgnoredNodesLeft, hasCode } from './utils';
import { stateKey } from './';

export interface Command {
  (state: EditorState, dispatch?: (tr: Transaction) => void): boolean;
}

export const moveRight = (): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const { code } = state.schema.marks;
    const { empty, $cursor } = state.selection as TextSelection;
    if (!empty || !$cursor) {
      return false;
    }
    const { storedMarks } = state.tr;
    const insideCode = stateKey.getState(state).markActive(code.create());
    const currentPosHasCode = state.doc.rangeHasMark($cursor.pos, $cursor.pos, code);
    const nextPosHasCode = state.doc.rangeHasMark($cursor.pos, $cursor.pos + 1, code);

    const exitingCode = !currentPosHasCode && !nextPosHasCode && (!storedMarks || !!storedMarks.length);
    const enteringCode = !currentPosHasCode && nextPosHasCode && (!storedMarks || !storedMarks.length);

    // entering code mark (from the left edge): don't move the cursor, just add the mark
    if (!insideCode && enteringCode) {
      dispatch(state.tr.addStoredMark(code.create()));
      return true;
    }

    // exiting code mark: don't move the cursor, just remove the mark
    if (insideCode && exitingCode) {
      dispatch(state.tr.removeStoredMark(code));
      return true;
    }

    return false;
  };
};

export const moveLeft = (view: EditorView & { cursorWrapper?: any }): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const { code } = state.schema.marks;
    const { empty, $cursor } = state.selection as TextSelection;
    if (!empty || !$cursor) {
      return false;
    }

    const { storedMarks } = state.tr;
    const insideCode = stateKey.getState(state).markActive(code.create());
    const currentPosHasCode = hasCode(state, $cursor.pos);
    const nextPosHasCode = hasCode(state, $cursor.pos - 1);
    const nextNextPosHasCode = hasCode(state, $cursor.pos - 2);

    const exitingCode = currentPosHasCode && !nextPosHasCode && Array.isArray(storedMarks);
    const atLeftEdge = nextPosHasCode && !nextNextPosHasCode && (storedMarks === null || Array.isArray(storedMarks) && !!storedMarks.length);
    const atRightEdge = (
      ((exitingCode && Array.isArray(storedMarks) && !storedMarks.length) ||
      !exitingCode && storedMarks === null) &&
      !nextPosHasCode && nextNextPosHasCode
    );
    const enteringCode = !currentPosHasCode && nextPosHasCode && Array.isArray(storedMarks) && !storedMarks.length;

    // removing ignored nodes (cursor wrapper) to make sure cursor isn't stuck
    if (view.cursorWrapper && !atLeftEdge && !atRightEdge) {
      removeIgnoredNodesLeft(view);
    }

    // at the right edge: remove code mark and move the cursor to the left
    if (!insideCode && atRightEdge) {
      const tr = state.tr.setSelection(Selection.near(state.doc.resolve($cursor.pos - 1)));
      dispatch(tr.removeStoredMark(code));
      return true;
    }

    // entering code mark (from right edge): don't move the cursor, just add the mark
    if (!insideCode && enteringCode) {
      dispatch(state.tr.addStoredMark(code.create()));
      return true;
    }

    // at the left edge: add code mark and move the cursor to the left
    if (insideCode && atLeftEdge) {
      const tr = state.tr.setSelection(Selection.near(state.doc.resolve($cursor.pos - 1)));
      dispatch(tr.addStoredMark(code.create()));
      return true;
    }

    // exiting code mark (or at the beginning of the line): don't move the cursor, just remove the mark
    const isFirstChild = $cursor.index($cursor.depth - 1) === 0;
    if (insideCode && (exitingCode || (!$cursor.nodeBefore && isFirstChild))) {
      dispatch(state.tr.removeStoredMark(code));
      return true;
    }

    return false;
  };
};

// removing ignored nodes (cursor wrapper) when pressing Backspace to make sure cursor isn't stuck
export const removeIgnoredNodes = (view: EditorView): Command => {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const { empty, $cursor } = state.selection as TextSelection;
    if (empty && $cursor && $cursor.nodeBefore) {
      removeIgnoredNodesLeft(view);
    }
    return false;
  };
};
