import { EditorState, Selection } from 'prosemirror-state';
import {
  isRowSelected,
  isColumnSelected,
  isCellSelection,
} from 'prosemirror-utils';
import { checkIfNumberColumnEnabled } from '../../utils';

export type TableSelection = {
  startIdx: number | null;
  endIdx: number | null;
  count: number;
  hasMultipleSelection: boolean;
  inSelection: (idx: number) => boolean;
  frontOfSelection: (idx: number) => boolean;
};

// collect a range of selected rows, to figure out where to draw the delete button
// and hide the insert row buttons between
//
// assumes only a single contiguous range of rows can be selected
const findTableSelection = <T extends Element>(
  state: EditorState,
  elems: NodeListOf<T> | HTMLCollection,
  isTableObjSelected: (idx: number) => (sel: Selection) => boolean,
  ignoreNumberColumn: boolean,
): TableSelection => {
  let startIdx: number | null = null;
  let endIdx: number | null = null;
  const inSelection = idx => {
    if (startIdx === null) {
      return false;
    }

    return idx >= startIdx! && idx <= endIdx!;
  };

  const frontOfSelection = idx => {
    if (startIdx === null) {
      return false;
    }

    return idx >= startIdx! && idx < endIdx!;
  };

  for (
    let i = ignoreNumberColumn && checkIfNumberColumnEnabled(state) ? 1 : 0,
      len = elems.length;
    i < len;
    i++
  ) {
    if (isTableObjSelected(i)(state.selection)) {
      if (startIdx === null) {
        startIdx = i;
      }
    } else if (startIdx !== null && endIdx === null) {
      endIdx = i - 1;
    }
  }

  if (startIdx !== null && endIdx === null) {
    endIdx = elems.length - 1;
  }

  return {
    startIdx,
    endIdx,
    count: startIdx === null ? 0 : endIdx! - startIdx + 1,
    hasMultipleSelection: startIdx !== null && startIdx !== endIdx,
    inSelection,
    frontOfSelection,
  };
};

export const findRowSelection = (
  state: EditorState,
  elems: NodeListOf<HTMLTableRowElement>,
) => {
  return findTableSelection(state, elems, isRowSelected, false);
};

export const findColumnSelection = (
  state: EditorState,
  elems: HTMLCollection,
) => {
  return findTableSelection(state, elems, isColumnSelected, false);
};

export const isSelectionUpdated = (oldSelection, newSelection) =>
  isCellSelection(oldSelection!) !== isCellSelection(newSelection) ||
  (isCellSelection(oldSelection!) &&
    isCellSelection(newSelection) &&
    oldSelection!.ranges !== newSelection.ranges);
