import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TableMap, selectionCell } from 'prosemirror-tables';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
  addColumnAt,
  addRowAt,
  selectRow,
} from 'prosemirror-utils';
import { pluginKey as hoverSelectionPluginKey } from './pm-plugins/hover-selection-plugin';
import {
  createHoverDecorationSet,
  getCellSelection,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  containsTable,
} from './utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';
import { Node, Slice, Fragment, Schema } from 'prosemirror-model';

export const resetHoverSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: DecorationSet.empty,
      isTableHovered: false,
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

export const clearHoverTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: DecorationSet.empty,
        isTableHovered: false,
        isTableInDanger: false,
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
