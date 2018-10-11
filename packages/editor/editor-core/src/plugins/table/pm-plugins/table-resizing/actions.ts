import { TableMap } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import {
  TableLayout,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';
import { TableCssClassName as ClassName } from '../../types';
import { addContainerLeftRightPadding } from './resizer/utils';

import Resizer from './resizer/resizer';

import { getPluginState } from '../main';
import { updateRightShadow } from '../../nodeviews/TableComponent';

import { hasTableBeenResized } from '../../utils';
import { getCellMinWidth } from '../../index';
import { getLayoutSize } from './utils';

export function updateColumnWidth(view, cell, movedWidth, resizer) {
  let $cell = view.state.doc.resolve(cell);
  let table = $cell.node(-1);
  let map = TableMap.get(table);
  let start = $cell.start(-1);
  let col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;

  const newState = resizer.resize(col, movedWidth);
  const tr = applyColumnWidths(view, newState, table, start);

  if (tr.docChanged) {
    view.dispatch(tr);
  }
}

export function applyColumnWidths(view, state, table, start) {
  let tr = view.state.tr;
  let map = TableMap.get(table);
  for (let i = 0; i < state.cols.length; i++) {
    const width = state.cols[i].width;

    for (let row = 0; row < map.height; row++) {
      let mapIndex = row * map.width + i;
      // Rowspanning cell that has already been handled
      if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) {
        continue;
      }
      let pos = map.map[mapIndex];
      let { attrs } = table.nodeAt(pos);
      let index = attrs.colspan === 1 ? 0 : i - map.colCount(pos);

      if (attrs.colwidth && attrs.colwidth[index] === width) {
        continue;
      }

      let colwidth = attrs.colwidth
        ? attrs.colwidth.slice()
        : Array.from({ length: attrs.colspan }, _ => 0);

      colwidth[index] = width;
      tr = tr.setNodeMarkup(start + pos, null, { ...attrs, colwidth });
    }
  }
  return tr;
}

export function handleBreakoutContent(
  view: EditorView,
  elem: HTMLElement,
  start: number,
  minWidth: number,
  node: PMNode,
) {
  const colIdx = Array.from((elem.parentNode as HTMLElement).children).indexOf(
    elem,
  );

  const cellStyle = getComputedStyle(elem);
  const amount = addContainerLeftRightPadding(
    minWidth - elem.offsetWidth,
    cellStyle,
  );

  const state = resizeColumnTo(elem, colIdx, amount, node);

  updateControls(view.state);

  if (state) {
    const tr = applyColumnWidths(view, state, node, start);

    if (tr.docChanged) {
      view.dispatch(tr);
    }
  }
}

export function resizeColumn(view, cell, width, resizer) {
  let $cell = view.state.doc.resolve(cell);
  let table = $cell.node(-1);
  let start = $cell.start(-1);
  let col =
    TableMap.get(table).colCount($cell.pos - start) +
    $cell.nodeAfter.attrs.colspan -
    1;

  const newState = resizer.resize(col, width);
  resizer.apply(newState);

  return newState;
}

/**
 * Updates the column controls on resize
 */
export const updateControls = (state: EditorState) => {
  const { tableRef } = getPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const cols = tr.children;
  const wrapper = tableRef.parentElement;
  const columnControls: any = wrapper.querySelectorAll(
    `.${ClassName.COLUMN_CONTROLS_BUTTON_WRAP}`,
  );
  const rows = tableRef.querySelectorAll('tr');
  const rowControls: any = wrapper.parentElement.querySelectorAll(
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`,
  );
  const numberedRows = wrapper.parentElement.querySelectorAll(
    ClassName.NUMBERED_COLUMN_BUTTON,
  );

  // update column controls width on resize
  for (let i = 0, count = columnControls.length; i < count; i++) {
    columnControls[i].style.width = `${cols[i].offsetWidth + 1}px`;
  }
  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    rowControls[i].style.height = `${rows[i].offsetHeight + 1}px`;

    if (numberedRows.length) {
      numberedRows[i].style.height = `${rows[i].offsetHeight + 1}px`;
    }
  }

  updateRightShadow(
    wrapper,
    tableRef,
    wrapper.parentElement.querySelector(`.${ClassName.TABLE_RIGHT_SHADOW}`),
  );
};

/**
 * Scale the table to meet new requirements (col, layout change etc)
 * @param view
 * @param dom
 * @param node
 * @param pos
 * @param containerWidth
 * @param currentLayout
 */
export function scaleTable(
  view: EditorView,
  dom: HTMLTableElement | null,
  node: PMNode,
  pos: number,
  containerWidth: number | undefined,
  currentLayout: TableLayout,
) {
  const state = setColumnWidths(dom, node, containerWidth, currentLayout);

  if (state) {
    const tr = applyColumnWidths(view, state, node, pos + 1);

    if (tr.docChanged) {
      view.dispatch(tr);
    }
  }
}

/**
 * Hydate a table with column widths.
 * @param dom
 * @param node
 * @param containerWidth
 * @param currentLayout
 */
export function setColumnWidths(
  dom: HTMLTableElement | null,
  node: PMNode,
  containerWidth: number | undefined,
  currentLayout: TableLayout,
) {
  if (!dom) {
    return;
  }

  const maxSize = getLayoutSize(currentLayout, containerWidth);
  return scale(dom, node, maxSize);
}

/**
 * Light wrapper over Resizer.resize
 * Mainly used to re-set a columns width.
 * @param elem
 * @param colIdx
 * @param amount
 * @param node
 */
export function resizeColumnTo(
  elem: HTMLElement,
  colIdx: number,
  amount: number,
  node: PMNode,
) {
  while (elem.nodeName !== 'TABLE') {
    elem = elem.parentNode as HTMLElement;
  }

  const resizer = new Resizer(elem as HTMLTableElement, {
    minWidth: getCellMinWidth(true),
    maxSize: elem.offsetWidth,
    node: node,
  });

  const newState = resizer.resize(colIdx, amount);
  resizer.apply(newState);

  return newState;
}

/**
 * Base function to trigger the actual scale on a table node.
 * Will only resize/scale if a table has been previously resized.
 * @param dom
 * @param node
 * @param maxSize
 */
function scale(dom: HTMLTableElement, node: PMNode, maxSize: number) {
  if (node.attrs.isNumberColumnEnabled) {
    maxSize -= akEditorTableNumberColumnWidth;
  }

  const resizer = new Resizer(dom, {
    minWidth: getCellMinWidth(true),
    maxSize: dom.offsetWidth,
    node: node,
  });

  // If a table has not been resized yet, columns should be auto.
  if (hasTableBeenResized(node)) {
    return resizer.scale(maxSize);
  }
}
