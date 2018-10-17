import { EditorView } from 'prosemirror-view';
import { findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
import { Node as PmNode } from 'prosemirror-model';
import { browser } from '@atlaskit/editor-common';
import { getPluginState } from './pm-plugins/main';
import { TableCssClassName as ClassName } from './types';
import {
  isElementInTableCell,
  setNodeSelection,
  isLastItemMediaGroup,
  closestElement,
} from '../../utils/';
import {
  setEditorFocus,
  showInsertColumnButton,
  showInsertRowButton,
  clearHoverSelection,
} from './actions';

const isIE11 = browser.ie_version === 11;

const isInsertColumnButton = (node: HTMLElement) =>
  node.classList.contains(ClassName.CONTROLS_INSERT_COLUMN) ||
  closestElement(node, `.${ClassName.CONTROLS_INSERT_COLUMN}`);

const isInsertRowButton = (node: HTMLElement) =>
  node.classList.contains(ClassName.CONTROLS_INSERT_ROW) ||
  closestElement(node, `.${ClassName.CONTROLS_INSERT_ROW}`);

const getIndex = (target: HTMLElement) =>
  parseInt(target.getAttribute('data-index') || '-1', 10);

export const handleBlur = (view: EditorView, event): boolean => {
  const { state, dispatch } = view;
  // fix for issue ED-4665
  if (!isIE11) {
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

  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );
  if (
    typeof insertColumnButtonIndex === 'number' ||
    typeof insertRowButtonIndex === 'number'
  ) {
    return clearHoverSelection(state, dispatch);
  }

  return false;
};

export const handleMouseLeave = (view: EditorView): boolean => {
  const { state, dispatch } = view;
  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );
  if (
    typeof insertColumnButtonIndex === 'number' ||
    typeof insertRowButtonIndex === 'number'
  ) {
    return clearHoverSelection(state, dispatch);
  }
  return false;
};
