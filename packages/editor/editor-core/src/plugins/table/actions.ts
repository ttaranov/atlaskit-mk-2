import {
  EditorState,
  Transaction,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import {
  goToNextCell as baseGotoNextCell,
  selectionCell,
  TableMap,
  CellSelection,
} from 'prosemirror-tables';
import { Node as PMNode, Slice, Schema } from 'prosemirror-model';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
  addColumnAt,
  addRowAt,
  isCellSelection,
  removeTable,
  removeSelectedColumns,
  removeSelectedRows,
  hasParentNodeOfType,
  setTextSelection,
  findParentNodeOfType,
  safeInsert,
  createTable as createTableNode,
  removeColumnAt,
  removeRowAt,
  findCellClosestToPos,
  emptyCell,
  setCellAttrs,
  selectColumn as selectColumnTransform,
  selectRow as selectRowTransform,
} from 'prosemirror-utils';
import { getPluginState, pluginKey, ACTIONS } from './pm-plugins/main';
import {
  createControlsHoverDecoration,
  getCellSelection,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  getSelectionRect,
  isHeaderRowSelected,
  isIsolating,
} from './utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';
import { outdentList } from '../lists/commands';
import { mapSlice } from '../../utils/slice';
import { Cell, TableCssClassName as ClassName } from './types';
import { closestElement } from '../../utils';

export const clearHoverSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, { action: ACTIONS.CLEAR_HOVER_SELECTION }),
  );
  return true;
};

export const hoverColumns = (columns: number[], danger?: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = columns.reduce((acc: Cell[], colIdx) => {
      const colCells = getCellsInColumn(colIdx)(state.selection);
      return colCells ? acc.concat(colCells) : acc;
    }, []);
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_COLUMNS,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, danger),
            dangerColumns: danger ? columns : [],
          },
        })
        .setMeta('addToHistory', false),
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
    const cells = rows.reduce((acc: Cell[], rowIdx) => {
      const rowCells = getCellsInRow(rowIdx)(state.selection);
      return rowCells ? acc.concat(rowCells) : acc;
    }, []);
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_ROWS,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, danger),
            dangerRows: danger ? rows : [],
          },
        })
        .setMeta('addToHistory', false),
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
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HOVER_TABLE,
          data: {
            hoverDecoration: createControlsHoverDecoration(cells, danger),
            isTableInDanger: danger,
          },
        })
        .setMeta('addToHistory', false),
    );

    return true;
  }
  return false;
};

export const clearSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr
      .setSelection(Selection.near(state.selection.$from))
      .setMeta('addToHistory', false),
  );
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
  clearHoverSelection(state, dispatch);

  // Dont clone the header row
  const headerRowEnabled = checkIfHeaderRowEnabled(state);
  const clonePreviousRow =
    (headerRowEnabled && row > 1) || (!headerRowEnabled && row >= 0);

  const tr = addRowAt(row, clonePreviousRow)(state.tr);

  const table = findTable(tr.selection)!;
  // move the cursor to the newly created row
  const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.row.button');
  return true;
};

export const triggerUnlessTableHeader = (command: Command): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const {
    selection,
    schema: {
      nodes: { tableHeader },
    },
  } = state;

  if (selection instanceof TextSelection) {
    const cell = findCellClosestToPos(selection.$from);
    if (cell && cell.node.type !== tableHeader) {
      return command(state, dispatch);
    }
  }

  if (selection instanceof CellSelection) {
    const rect = getSelectionRect(selection);
    if (!checkIfHeaderRowEnabled(state) || (rect && rect.top > 0)) {
      return command(state, dispatch);
    }
  }

  return false;
};

export function transformSliceToAddTableHeaders(
  slice: Slice,
  schema: Schema,
): Slice {
  const { table, tableHeader, tableRow } = schema.nodes;

  return mapSlice(slice, maybeTable => {
    if (maybeTable.type === table) {
      const firstRow = maybeTable.firstChild;
      if (firstRow) {
        const headerCols = [] as PMNode[];
        firstRow.forEach(oldCol => {
          headerCols.push(
            tableHeader.createChecked(
              oldCol.attrs,
              oldCol.content,
              oldCol.marks,
            ),
          );
        });
        const headerRow = tableRow.createChecked(
          firstRow.attrs,
          headerCols,
          firstRow.marks,
        );
        return maybeTable.copy(maybeTable.content.replaceChild(0, headerRow));
      }
    }
    return maybeTable;
  });
}

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
  } = getPluginState(state);
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

export const toggleTableLayout: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  let layout;
  switch (table.node.attrs.layout) {
    case 'default':
      layout = 'wide';
      break;
    case 'wide':
      layout = 'full-width';
      break;
    case 'full-width':
      layout = 'default';
      break;
  }
  dispatch(
    state.tr.setNodeMarkup(table.pos, state.schema.nodes.table, {
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
  if (!pluginKey.get(state)) {
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
  const pluginState = getPluginState(state);
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

export const deleteColumns = (indexes: number[]): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  let { tr } = state;
  for (let i = indexes.length; i >= 0; i--) {
    tr = removeColumnAt(indexes[i])(tr);
  }
  if (tr.docChanged) {
    dispatch(setTextSelection(tr.selection.$from.pos)(tr));
    return true;
  }
  return false;
};

export const deleteRows = (indexes: number[]): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  let { tr } = state;
  for (let i = indexes.length; i >= 0; i--) {
    tr = removeRowAt(indexes[i])(tr);
  }
  if (tr.docChanged) {
    dispatch(setTextSelection(tr.selection.$from.pos)(tr));
    return true;
  }
  return false;
};

export const emptyMultipleCells = (targetCellPosition?: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((node, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetCellPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1))!;
    tr = emptyCell(cell, state.schema)(tr);
    cursorPos = cell.pos;
  }
  if (tr.docChanged) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
    const textSelection = Selection.findFrom($pos, 1, true);
    if (textSelection) {
      tr.setSelection(textSelection);
    }
    dispatch(tr);
    return true;
  }
  return false;
};

export const setMultipleCellAttrs = (
  attrs: Object,
  targetCellPosition?: number,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((cell, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetCellPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1))!;
    tr = setCellAttrs(cell, attrs)(tr);
    cursorPos = cell.pos;
  }
  if (tr.docChanged) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
    dispatch(tr.setSelection(Selection.near($pos)));
    return true;
  }
  return false;
};

export const toggleContextualMenu: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr
      .setMeta(pluginKey, {
        action: ACTIONS.TOGGLE_CONTEXTUAL_MENU,
      })
      .setMeta('addToHistory', false),
  );
  return true;
};

export const setEditorFocus = (editorHasFocus: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      action: ACTIONS.SET_EDITOR_FOCUS,
      data: { editorHasFocus },
    }),
  );
  return true;
};

export const setTableRef = (tableRef?: HTMLElement): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr
      .setMeta(pluginKey, {
        action: ACTIONS.SET_TABLE_REF,
        data: { tableRef },
      })
      .setMeta('addToHistory', false),
  );
  return true;
};

export const selectColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = selectColumnTransform(column)(state.tr);
  const firstCell = getCellsInColumn(column)(tr.selection)![0];
  // update contextual menu target cell position on column selection
  dispatch(
    tr
      .setMeta(pluginKey, {
        action: ACTIONS.SET_TARGET_CELL_POSITION,
        data: { targetCellPosition: firstCell.pos },
      })
      .setMeta('addToHistory', false),
  );
  return true;
};

export const selectRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = selectRowTransform(row)(state.tr);
  const firstCell = getCellsInRow(row)(tr.selection)![0];
  // update contextual menu target cell position on row selection
  dispatch(
    tr
      .setMeta(pluginKey, {
        action: ACTIONS.SET_TARGET_CELL_POSITION,
        data: { targetCellPosition: firstCell.pos },
      })
      .setMeta('addToHistory', false),
  );
  return true;
};

export const showInsertColumnButton = (columnIndex: number): Command => (
  state,
  dispatch,
) => {
  const { insertColumnButtonIndex } = getPluginState(state);
  if (columnIndex > -1 && insertColumnButtonIndex !== columnIndex) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.SHOW_INSERT_COLUMN_BUTTON,
          data: {
            insertColumnButtonIndex: columnIndex,
          },
        })
        .setMeta('addToHistory', false),
    );
    return true;
  }
  return false;
};

export const showInsertRowButton = (rowIndex: number): Command => (
  state,
  dispatch,
) => {
  const { insertRowButtonIndex } = getPluginState(state);
  if (rowIndex > -1 && insertRowButtonIndex !== rowIndex) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.SHOW_INSERT_ROW_BUTTON,
          data: {
            insertRowButtonIndex: rowIndex,
          },
        })
        .setMeta('addToHistory', false),
    );
    return true;
  }
  return false;
};

export const hideInsertColumnOrRowButton: Command = (state, dispatch) => {
  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );
  if (
    typeof insertColumnButtonIndex === 'number' ||
    typeof insertRowButtonIndex === 'number'
  ) {
    dispatch(
      state.tr
        .setMeta(pluginKey, {
          action: ACTIONS.HIDE_INSERT_COLUMN_OR_ROW_BUTTON,
        })
        .setMeta('addToHistory', false),
    );
    return true;
  }

  return false;
};

export const handleCut = (
  oldTr: Transaction,
  oldState: EditorState,
  newState: EditorState,
): Transaction => {
  const oldSelection = oldState.tr.selection;
  let { tr } = newState;
  if (oldSelection instanceof CellSelection) {
    const $anchorCell = oldTr.doc.resolve(
      oldTr.mapping.map(oldSelection.$anchorCell.pos),
    );
    const $headCell = oldTr.doc.resolve(
      oldTr.mapping.map(oldSelection.$headCell.pos),
    );
    tr.setSelection(new CellSelection($anchorCell, $headCell) as any);

    if (tr.selection instanceof CellSelection) {
      if (tr.selection.isRowSelection()) {
        tr = removeSelectedRows(tr);
      } else if (tr.selection.isColSelection()) {
        tr = removeSelectedColumns(tr);
      }
    }
  }

  return tr;
};

export const handleShiftSelection = (event: MouseEvent): Command => (
  state,
  dispatch,
) => {
  if (!(state.selection instanceof CellSelection) || !event.shiftKey) {
    return false;
  }
  const { selection } = state;
  if (selection.isRowSelection() || selection.isColSelection()) {
    const selector = selection.isRowSelection()
      ? `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`
      : `.${ClassName.COLUMN_CONTROLS_BUTTON_WRAP}`;
    const button = closestElement(event.target as HTMLElement, selector);
    if (!button) {
      return false;
    }

    const buttons = document.querySelectorAll(selector);
    const index = Array.from(buttons).indexOf(button);
    const rect = getSelectionRect(selection)!;
    const startCells = selection.isRowSelection()
      ? getCellsInRow(index >= rect.bottom ? rect.top : rect.bottom - 1)(
          selection,
        )
      : getCellsInColumn(index >= rect.right ? rect.left : rect.right - 1)(
          selection,
        );
    const endCells = selection.isRowSelection()
      ? getCellsInRow(index)(selection)
      : getCellsInColumn(index)(selection);
    if (startCells && endCells) {
      event.stopPropagation();
      event.preventDefault();
      dispatch(
        state.tr.setSelection(new CellSelection(
          state.doc.resolve(startCells[startCells.length - 1].pos),
          state.doc.resolve(endCells[0].pos),
        ) as any),
      );
      return true;
    }
  }

  return false;
};
