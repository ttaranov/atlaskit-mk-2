import { cellAround, TableMap } from 'prosemirror-tables';
import {
  calcTableWidth,
  TableLayout,
  akEditorWideLayoutWidth,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-common';

const tableLayoutToSize = {
  default: akEditorDefaultLayoutWidth,
  wide: akEditorWideLayoutWidth,
  'full-width': undefined,
};

/**
 * Translates named layouts in number values.
 * @param tableLayout
 * @param containerWidth
 */
export function getLayoutSize(
  tableLayout: TableLayout,
  containerWidth: number = 0,
) {
  const calculatedTableWidth = calcTableWidth(tableLayout, containerWidth);
  return calculatedTableWidth.endsWith('px')
    ? Number(calculatedTableWidth.slice(0, calculatedTableWidth.length - 2))
    : tableLayoutToSize[tableLayout] || containerWidth;
}

/**
 * Does the current position point at a cell.
 * @param $pos
 */
export function pointsAtCell($pos) {
  return $pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter;
}

/**
 * Returns the pos of the cell on the side requested.
 * @param view
 * @param event
 * @param side
 */
export function edgeCell(view, event, side) {
  const buffer = side === 'right' ? -5 : 5; // Fixes finicky bug where posAtCoords could return wrong pos.
  let { pos } = view.posAtCoords({
    left: event.clientX + buffer,
    top: event.clientY,
  });
  let $cell = cellAround(view.state.doc.resolve(pos));
  if (!$cell) {
    return -1;
  }
  if (side === 'right') {
    return $cell.pos;
  }

  let map = TableMap.get($cell.node(-1));
  let start = $cell.start(-1);
  let index = map.map.indexOf($cell.pos - start);

  return index % map.width === 0 ? -1 : start + map.map[index - 1];
}

/**
 * Get the current col width, handles colspan.
 * @param view
 * @param cellPos
 * @param param2
 */
export function currentColWidth(view, cellPos, { colspan, colwidth }) {
  let width = colwidth && colwidth[colwidth.length - 1];
  if (width) {
    return width;
  }
  // Not fixed, read current width from DOM
  let domWidth = view.domAtPos(cellPos + 1).node.offsetWidth;
  let parts = colspan;
  if (colwidth) {
    for (let i = 0; i < colspan; i++) {
      if (colwidth[i]) {
        domWidth -= colwidth[i];
        parts--;
      }
    }
  }

  return domWidth / parts;
}

/**
 * Attempts to find a parent TD/TH depending on target element.
 * @param target
 */
export function domCellAround(target) {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror')
      ? null
      : target.parentNode;
  }
  return target;
}
