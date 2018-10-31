import {
  EditorState,
  Transaction,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { removeNodeBefore } from 'prosemirror-utils';
import { GapCursorSelection, Side } from './selection';
import { isIgnored } from './utils';
import { Command } from '../../types';
import { pluginKey } from './pm-plugins/main';

export enum Direction {
  BACKWARD,
  FORWARD,
}

export const arrow = (
  direction: Direction,
  endOfTextblock: (dir: string, state?: EditorState) => boolean,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const side = direction === Direction.BACKWARD ? Side.LEFT : Side.RIGHT;

  const { selection, tr } = state;
  let $pos = side === Side.RIGHT ? selection.$to : selection.$from;
  let mustMove = selection.empty;

  // start from text selection
  if (selection instanceof TextSelection) {
    if (!endOfTextblock(side === Side.RIGHT ? 'right' : 'left')) {
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
    nextSelection = GapCursorSelection.findFrom(
      $pos,
      direction === Direction.BACKWARD ? -1 : 1,
      mustMove,
    );
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

export const deleteNode = (direction: Direction): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (state.selection instanceof GapCursorSelection) {
    const { $from } = state.selection;
    let { tr } = state;
    if (direction === Direction.BACKWARD) {
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

export const setGapCursorAtPos = (
  position: number,
  side: Side = Side.LEFT,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const $pos = state.doc.resolve(position);

  if (GapCursorSelection.valid($pos)) {
    dispatch(state.tr.setSelection(new GapCursorSelection($pos, side)));
    return true;
  }

  return false;
};

// This function captures clicks outside of the ProseMirror contentEditable area
// see also description of "handleClick" in gap-cursor pm-plugin
const captureCursorCoords = (
  event: MouseEvent,
  editorRef: HTMLElement,
  posAtCoords: (
    coords: { left: number; top: number },
  ) => { pos: number; inside: number } | null | void,
  state: EditorState,
): { position: number; side: Side } | null => {
  const rect = editorRef.getBoundingClientRect();

  // capture clicks before the first block element
  if (event.clientY < rect.top) {
    return { position: 0, side: Side.LEFT };
  }

  if (rect.left > 0) {
    // calculate start position of a node that is vertically at the same level
    const coords = posAtCoords({
      left: rect.left,
      top: event.clientY,
    });
    if (coords && coords.inside > -1) {
      const $from = state.doc.resolve(coords.inside);
      const start = $from.before(1);

      const side = event.clientX < rect.left ? Side.LEFT : Side.RIGHT;
      let position;
      if (side === Side.LEFT) {
        position = start;
      } else {
        const node = state.doc.nodeAt(start);
        if (node) {
          position = start + node.nodeSize;
        }
      }

      return { position, side };
    }
  }

  return null;
};

export const setCursorForTopLevelBlocks = (
  event: MouseEvent,
  editorRef: HTMLElement,
  posAtCoords: (
    coords: { left: number; top: number },
  ) => { pos: number; inside: number } | null | void,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  // plugin is disabled
  if (!pluginKey.get(state)) {
    return false;
  }
  const cursorCoords = captureCursorCoords(
    event,
    editorRef,
    posAtCoords,
    state,
  );
  if (!cursorCoords) {
    return false;
  }

  const $pos = state.doc.resolve(cursorCoords.position);
  const isGapCursorAllowed =
    cursorCoords.side === Side.LEFT
      ? $pos.nodeAfter && !isIgnored($pos.nodeAfter)
      : $pos.nodeBefore && !isIgnored($pos.nodeBefore);

  if (isGapCursorAllowed && GapCursorSelection.valid($pos)) {
    // this forces PM to re-render the decoration node if we change the side of the gap cursor, it doesn't do it by default
    if (state.selection instanceof GapCursorSelection) {
      dispatch(state.tr.setSelection(Selection.near($pos)));
    }
    dispatch(
      state.tr.setSelection(new GapCursorSelection($pos, cursorCoords.side)),
    );
    return true;
  }
  // try to set text selection
  else {
    const selection = Selection.findFrom(
      $pos,
      cursorCoords.side === Side.LEFT ? 1 : -1,
      true,
    );
    if (selection) {
      dispatch(state.tr.setSelection(selection));
      return true;
    }
  }

  return false;
};
