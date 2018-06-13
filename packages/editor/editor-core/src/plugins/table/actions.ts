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
} from 'prosemirror-utils';
import { pluginKey as hoverSelectionPluginKey } from './pm-plugins/hover-selection-plugin';
import { stateKey as tablePluginKey } from './pm-plugins/main';
import {
  createHoverDecorationSet,
  getCellSelection,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
} from './utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';
import { Node } from 'prosemirror-model';

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
  const { isNumberColumnEnabled } = table.node.attrs;
  const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
  const isHeaderColumnEnabled = checkIfHeaderColumnEnabled(state);
  const type = isHeaderRowEnabled ? tableCell : tableHeader;

  for (let column = 0; column < table.node.child(0).childCount; column++) {
    // skip header column
    if (
      isHeaderColumnEnabled &&
      ((isNumberColumnEnabled && column === 1) ||
        (!isNumberColumnEnabled && column === 0))
    ) {
      continue;
    }
    const from = tr.mapping.map(table.pos + map.map[column]);
    const cell = table.node.child(0).child(column);
    // empty first cell of the number column when converting to header row (remove "1")
    if (!isHeaderRowEnabled && isNumberColumnEnabled && column === 0) {
      tr.replaceWith(
        from,
        from + cell.nodeSize,
        tableHeader.createAndFill(cell.attrs)!,
      );
    } else {
      tr.setNodeMarkup(from, type, cell.attrs);
    }
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
    const column = table.node.attrs.isNumberColumnEnabled ? 1 : 0;
    const cell = table.node.child(row).child(column);
    tr.setNodeMarkup(
      table.pos + map.map[column + row * map.width],
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
  const { tableNode } = tablePluginKey.getState(state);
  const map = TableMap.get(tableNode);
  const { pos: start } = findTable(state.selection)!;

  if (tableNode.attrs.isNumberColumnEnabled) {
    // delete existing number column
    const mapStart = tr.mapping.maps.length;
    for (let i = 0, count = tableNode.childCount; i < count; i++) {
      const cell = tableNode.child(i).child(0);
      const pos = map.positionAt(i, 0, tableNode);
      const from = tr.mapping.slice(mapStart).map(start + pos);
      tr.delete(from, from + cell.nodeSize);
    }
    tr.setNodeMarkup(start - 1, state.schema.nodes.table, {
      ...tableNode.attrs,
      isNumberColumnEnabled: false,
    });
    dispatch(tr);
  } else {
    // insert number column
    let index = 1;
    let inserted = false;
    const { tableHeader, tableCell, paragraph } = state.schema.nodes;
    const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
    for (let i = 0, count = tableNode.childCount; i < count; i++) {
      const cell = tableNode.child(i).child(0);
      const from = map.positionAt(i, 0, tableNode);
      const content =
        cell.type === tableHeader && i === 0
          ? null
          : paragraph.createChecked({}, state.schema.text(`${index++}`));
      const type = isHeaderRowEnabled && i === 0 ? tableHeader : tableCell;
      if (content) {
        inserted = true;
      }
      tr.insert(tr.mapping.map(start + from), type.create({}, content!));
    }
    if (inserted) {
      tr.setNodeMarkup(start - 1, state.schema.nodes.table, {
        ...tableNode.attrs,
        isNumberColumnEnabled: true,
      });
      dispatch(tr);
    }
  }
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
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.pos + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.column.button');
  return true;
};

export const insertRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = addRowAt(row)(state.tr);
  const table = findTable(tr.selection)!;
  // move the cursor to the newly created row
  const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.pos + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.row.button');
  return true;
};
