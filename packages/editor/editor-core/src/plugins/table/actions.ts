import {
  EditorState,
  Transaction,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import {
  goToNextCell as baseGotoNextCell,
  selectionCell,
  TableMap,
} from 'prosemirror-tables';
import { Node, Slice, Fragment, Schema } from 'prosemirror-model';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
  addColumnAt,
  addRowAt,
  selectRow,
  isCellSelection,
  removeTable,
  removeSelectedColumns,
  removeSelectedRows,
  hasParentNodeOfType,
  setTextSelection,
  findParentNodeOfType,
  safeInsert,
  createTable as createTableNode,
} from 'prosemirror-utils';
import { TableLayout } from '@atlaskit/editor-common';
import { pluginKey as hoverSelectionPluginKey } from './pm-plugins/hover-selection-plugin';
import { stateKey as tablePluginKey } from './pm-plugins/main';
import {
  createHoverDecorationSet,
  getCellSelection,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  containsTable,
  getSelectionRect,
  isHeaderRowSelected,
  isIsolating,
} from './utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';
import { outdentList } from '../../commands';

export const resetHoverSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: DecorationSet.empty,
      isTableHovered: false,
      isTableInDanger: false,
    }),
  );
  return true;
};

export const hoverColumns = (columns: number[], danger?: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = columns.reduce(
      (acc: { pos: number; node: Node }[], colIdx) => {
        const colCells = getCellsInColumn(colIdx)(state.selection);
        return colCells ? acc.concat(colCells) : acc;
      },
      [],
    );

    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state, danger),
      }),
    );
    return true;
  }
  return false;
};

export const hoverRows = (rows: number[], danger?: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = rows.reduce((acc: { pos: number; node: Node }[], rowIdx) => {
      const rowCells = getCellsInRow(rowIdx)(state.selection);
      return rowCells ? acc.concat(rowCells) : acc;
    }, []);

    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state, danger),
      }),
    );
    return true;
  }
  return false;
};

export const hoverTable = (danger?: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = getCellsInTable(state.selection)!;
    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state, danger),
        isTableHovered: true,
        isTableInDanger: danger,
      }),
    );
    return true;
  }
  return false;
};

export const clearSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setSelection(Selection.near(state.selection.$from)));
  return true;
};

export const toggleHeaderRow: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { tr } = state;
  const map = TableMap.get(table.node);
  const { tableHeader, tableCell } = state.schema.nodes;
  const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
  const isHeaderColumnEnabled = checkIfHeaderColumnEnabled(state);
  const type = isHeaderRowEnabled ? tableCell : tableHeader;

  for (let column = 0; column < table.node.child(0).childCount; column++) {
    // skip header column
    if (isHeaderColumnEnabled && column === 0) {
      continue;
    }
    const from = tr.mapping.map(table.start + map.map[column]);
    const cell = table.node.child(0).child(column);

    tr.setNodeMarkup(from, type, cell.attrs);
  }
  dispatch(tr);
  return true;
};

export const toggleHeaderColumn: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { tr } = state;
  const map = TableMap.get(table.node);
  const { tableHeader, tableCell } = state.schema.nodes;
  const type = checkIfHeaderColumnEnabled(state) ? tableCell : tableHeader;

  // skip header row
  const startIndex = checkIfHeaderRowEnabled(state) ? 1 : 0;
  for (let row = startIndex; row < table.node.childCount; row++) {
    const column = 0;
    const cell = table.node.child(row).child(column);
    tr.setNodeMarkup(
      table.start + map.map[column + row * map.width],
      type,
      cell.attrs,
    );
  }
  dispatch(tr);
  return true;
};

export const toggleNumberColumn: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tr } = state;
  const { node, pos } = findTable(state.selection)!;

  tr.setNodeMarkup(pos, state.schema.nodes.table, {
    ...node.attrs,
    isNumberColumnEnabled: !node.attrs.isNumberColumnEnabled,
  });
  dispatch(tr);
  return true;
};

export const setCellAttr = (name: string, value: any): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tr } = state;
  const cellSelection = getCellSelection(state);
  if (cellSelection) {
    let updated = false;
    cellSelection.forEachCell((cell, pos) => {
      if (cell.attrs[name] !== value) {
        tr.setNodeMarkup(pos, cell.type, { ...cell.attrs, [name]: value });
        updated = true;
      }
    });
    if (updated) {
      dispatch(tr);
      return true;
    }
  } else {
    const cell: any = selectionCell(state);
    if (cell) {
      dispatch(
        tr.setNodeMarkup(cell.pos, cell.nodeAfter.type, {
          ...cell.nodeAfter.attrs,
          [name]: value,
        }),
      );
      return true;
    }
  }
  return false;
};

export const insertColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = addColumnAt(column)(state.tr);
  const table = findTable(tr.selection)!;
  // move the cursor to the newly created column
  const pos = TableMap.get(table.node).positionAt(0, column, table.node);
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.column.button');
  return true;
};

export const insertRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  resetHoverSelection(state, dispatch);

  const tr = addRowAt(row)(state.tr);
  const table = findTable(tr.selection)!;
  // move the cursor to the newly created row
  const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.row.button');
  return true;
};

export function transformSliceToAddTableHeaders(
  slice: Slice,
  schema: Schema,
): Slice {
  if (!containsTable(schema, slice)) {
    return slice;
  }
  const nodes: Node[] = [];
  const { table, tableHeader, tableRow } = schema.nodes;

  // walk the slice content
  slice.content.forEach((node, _offset, _index) => {
    if (node.type === table) {
      const rows: Node[] = [];

      node.forEach((oldRow, _, rowIdx) => {
        if (rowIdx === 0) {
          // if it's the first row, make everything a header cell
          const headerCols: Node[] = [];
          oldRow.forEach((oldCol, _a, _b) => {
            headerCols.push(
              tableHeader.createChecked(
                oldCol.attrs,
                oldCol.content,
                oldCol.marks,
              ),
            );
          });

          // construct a new row that holds the header cells
          rows.push(
            tableRow.createChecked(oldRow.attrs, headerCols, oldRow.marks),
          );
        } else {
          // keep remainder of table unmodified
          rows.push(oldRow);
        }
      });

      nodes.push(table.createChecked(node.attrs, rows, node.marks));
    } else {
      // node wasn't a table, keep unmodified
      nodes.push(node);
    }
  });

  return new Slice(Fragment.from(nodes), slice.openStart, slice.openEnd);
}

export const selectRowClearHover = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  resetHoverSelection(state, dispatch);
  dispatch(selectRow(row)(state.tr));
  return true;
};

export const deleteTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(removeTable(state.tr));
  analyticsService.trackEvent('atlassian.editor.format.table.delete.button');
  return true;
};

export const convertFirstRowToHeader = (schema: Schema) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection)!;
  const map = TableMap.get(table.node);
  for (let i = 0; i < map.width; i++) {
    const cell = table.node.child(0).child(i);
    tr.setNodeMarkup(
      table.start + map.map[i],
      schema.nodes.tableHeader,
      cell.attrs,
    );
  }
  return tr;
};

export const deleteSelectedColumns: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (!isCellSelection(state.selection)) {
    return false;
  }
  let tr = removeSelectedColumns(state.tr);
  // sometimes cursor jumps out of the table when deleting last few columns
  if (!hasParentNodeOfType(state.schema.nodes.table)(tr.selection)) {
    // trying to put cursor back inside of the table
    const { start } = findTable(state.tr.selection)!;
    tr = setTextSelection(start)(tr);
  }
  const table = findTable(tr.selection)!;
  const map = TableMap.get(table.node);
  const rect = getSelectionRect(tr.selection);
  const columnIndex = rect
    ? Math.min(rect.left, rect.right) - 1
    : map.width - 1;
  const pos = map.positionAt(0, columnIndex < 0 ? 0 : columnIndex, table.node);
  // move cursor to the column to the left of the deleted column
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))));
  analyticsService.trackEvent(
    'atlassian.editor.format.table.delete_column.button',
  );
  return true;
};

export const deleteSelectedRows: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (!isCellSelection(state.selection)) {
    return false;
  }
  const {
    schema: {
      nodes: { tableHeader },
    },
  } = state;
  let tr = removeSelectedRows(state.tr);
  // sometimes cursor jumps out of the table when deleting last few columns
  if (!hasParentNodeOfType(state.schema.nodes.table)(tr.selection)) {
    // trying to put cursor back inside of the table
    const { start } = findTable(state.tr.selection)!;
    tr = setTextSelection(start)(tr);
  }
  const table = findTable(tr.selection)!;
  const map = TableMap.get(table.node);
  const rect = getSelectionRect(state.selection);
  const rowIndex = rect ? Math.min(rect.top, rect.bottom) : 0;
  const pos = map.positionAt(
    rowIndex === map.height ? rowIndex - 1 : rowIndex,
    0,
    table.node,
  );
  // move cursor to the beginning of the next row, or prev row if deleted row was the last row
  tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos)));
  // make sure header row is always present (for Bitbucket markdown)
  const {
    pluginConfig: { isHeaderRowRequired },
  } = tablePluginKey.getState(state);
  if (isHeaderRowRequired && isHeaderRowSelected(state)) {
    tr = convertFirstRowToHeader(state.schema)(tr);
  }
  dispatch(tr);
  const headerRow = hasParentNodeOfType(tableHeader)(tr.selection)
    ? 'header_'
    : '';
  analyticsService.trackEvent(
    `atlassian.editor.format.table.delete_${headerRow}row.button`,
  );
  return true;
};

export const setTableLayout = (layout: TableLayout): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { schema, tr } = state;
  dispatch(
    tr.setNodeMarkup(table.pos, schema.nodes.table, {
      ...table.node.attrs,
      layout,
    }),
  );
  return true;
};

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

export const createTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (!tablePluginKey.get(state)) {
    return false;
  }
  const table = createTableNode(state.schema);
  dispatch(safeInsert(table)(state.tr).scrollIntoView());
  return true;
};

export const goToNextCell = (direction: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const map = TableMap.get(table.node);
  const { tableCell, tableHeader } = state.schema.nodes;
  const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;
  const firstCellPos = map.positionAt(0, 0, table.node) + table.start;
  const lastCellPos =
    map.positionAt(map.height - 1, map.width - 1, table.node) + table.start;

  const event =
    direction === TAB_FORWARD_DIRECTION ? 'next_cell' : 'previous_cell';
  analyticsService.trackEvent(
    `atlassian.editor.format.table.${event}.keyboard`,
  );

  if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
    insertRow(0)(state, dispatch);
    return true;
  }

  if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
    insertRow(map.height)(state, dispatch);
    return true;
  }
  return baseGotoNextCell(direction)(state, dispatch);
};

export const moveCursorBackward: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = tablePluginKey.getState(state);
  const { $cursor } = state.selection as TextSelection;
  // if cursor is in the middle of a text node, do nothing
  if (
    !$cursor ||
    (pluginState.view
      ? !pluginState.view.endOfTextblock('backward', state)
      : $cursor.parentOffset > 0)
  ) {
    return false;
  }

  // find the node before the cursor
  let before;
  let cut;
  if (!isIsolating($cursor.parent)) {
    for (let i = $cursor.depth - 1; !before && i >= 0; i--) {
      if ($cursor.index(i) > 0) {
        cut = $cursor.before(i + 1);
        before = $cursor.node(i).child($cursor.index(i) - 1);
      }
      if (isIsolating($cursor.node(i))) {
        break;
      }
    }
  }

  // if the node before is not a table node - do nothing
  if (!before || before.type !== state.schema.nodes.table) {
    return false;
  }

  // ensure we're just at a top level paragraph
  // otherwise, perform regular backspace behaviour
  const grandparent = $cursor.node($cursor.depth - 1);
  const { listItem } = state.schema.nodes;

  if (
    $cursor.parent.type !== state.schema.nodes.paragraph ||
    (grandparent && grandparent.type !== state.schema.nodes.doc)
  ) {
    if (grandparent && grandparent.type === listItem) {
      return outdentList()(state, dispatch);
    } else {
      return false;
    }
  }

  const { tr } = state;
  const lastCellPos = cut - 4;
  // need to move cursor inside the table to be able to calculate table's offset
  tr.setSelection(new TextSelection(state.doc.resolve(lastCellPos)));
  const { $from } = tr.selection;
  const start = $from.start(-1);
  const pos = start + $from.parent.nodeSize - 1;
  // move cursor to the last cell
  // it doesn't join node before (last cell) with node after (content after the cursor)
  // due to ridiculous amount of PM code that would have been required to overwrite
  dispatch(tr.setSelection(new TextSelection(state.doc.resolve(pos))));

  return true;
};
