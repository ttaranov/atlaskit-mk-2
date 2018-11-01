import { EditorView } from 'prosemirror-view';
import { findTable } from 'prosemirror-utils';
import { TextSelection, Selection } from 'prosemirror-state';
import { TableMap, cellAround } from 'prosemirror-tables';
import { Node as PmNode } from 'prosemirror-model';
import { browser } from '@atlaskit/editor-common';

import {
  isElementInTableCell,
  setNodeSelection,
  isLastItemMediaGroup,
  closestElement,
} from '../../utils/';
import { isInsertColumnButton, isInsertRowButton, getIndex } from './utils';
import {
  setEditorFocus,
  showInsertColumnButton,
  showInsertRowButton,
  handleShiftSelection,
  hideInsertColumnOrRowButton,
} from './actions';

export const handleBlur = (view: EditorView, event): boolean => {
  const { state, dispatch } = view;
  // fix for issue ED-4665
  if (browser.ie_version !== 11) {
    setEditorFocus(false)(state, dispatch);
  }
  event.preventDefault();
  return false;
};

export const handleFocus = (view: EditorView, event): boolean => {
  const { state, dispatch } = view;
  setEditorFocus(true)(state, dispatch);
  event.preventDefault();
  return false;
};

export const handleClick = (view: EditorView, event): boolean => {
  const element = event.target as HTMLElement;
  const table = findTable(view.state.selection)!;

  /**
   * Check if the table cell with an image is clicked
   * and its not the image itself
   */
  const matches = element.matches ? 'matches' : 'msMatchesSelector';
  if (
    !table ||
    !isElementInTableCell(element) ||
    element[matches]('table .image, table p, table .image div')
  ) {
    return false;
  }
  const map = TableMap.get(table.node);

  /** Getting the offset of current item clicked */
  const colElement = (closestElement(element, 'td') ||
    closestElement(element, 'th')) as HTMLTableDataCellElement;
  const colIndex = colElement && colElement.cellIndex;
  const rowElement = closestElement(element, 'tr') as HTMLTableRowElement;
  const rowIndex = rowElement && rowElement.rowIndex;
  const cellIndex = map.width * rowIndex + colIndex;
  const posInTable = map.map[cellIndex + 1];

  const {
    dispatch,
    state: {
      tr,
      schema: {
        nodes: { paragraph },
      },
    },
  } = view;
  const editorElement = table.node.nodeAt(map.map[cellIndex]) as PmNode;

  /** Only if the last item is media group, insert a paragraph */
  if (isLastItemMediaGroup(editorElement)) {
    tr.insert(posInTable + table.pos, paragraph.create());
    dispatch(tr);
    setNodeSelection(view, posInTable + table.pos);
  }
  return true;
};

export const handleMouseOver = (
  view: EditorView,
  mouseEvent: MouseEvent,
): boolean => {
  const { state, dispatch } = view;
  const target = mouseEvent.target as HTMLElement;

  if (isInsertColumnButton(target)) {
    return showInsertColumnButton(getIndex(target))(state, dispatch);
  }
  if (isInsertRowButton(target)) {
    return showInsertRowButton(getIndex(target))(state, dispatch);
  }
  if (hideInsertColumnOrRowButton(state, dispatch)) {
    return true;
  }
  return false;
};

export const handleMouseLeave = (view: EditorView): boolean => {
  const { state, dispatch } = view;
  if (hideInsertColumnOrRowButton(state, dispatch)) {
    return true;
  }
  return false;
};

export function handleTripleClick(view, pos) {
  const { state, dispatch } = view;
  const $cellPos = cellAround(state.doc.resolve(pos));
  if (!$cellPos) {
    return false;
  }

  const cell = state.doc.nodeAt($cellPos.pos);
  if (cell) {
    const selFrom = Selection.findFrom($cellPos, 1, true);
    const selTo = Selection.findFrom(
      state.doc.resolve($cellPos.pos + cell.nodeSize),
      -1,
      true,
    );
    if (selFrom && selTo) {
      dispatch(
        state.tr.setSelection(new TextSelection(selFrom.$from, selTo.$to)),
      );
      return true;
    }
  }

  return false;
}
export const handleMouseDown = (
  view: EditorView,
  event: MouseEvent,
): boolean => {
  const { state, dispatch } = view;

  // shift-selecting table rows/columns
  if (handleShiftSelection(event)(state, dispatch)) {
    return true;
  }

  return false;
};
