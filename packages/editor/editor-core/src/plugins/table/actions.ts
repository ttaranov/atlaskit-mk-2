import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { CellSelection, TableMap, selectionCell } from 'prosemirror-tables';
import { Slice } from 'prosemirror-model';
import { pluginKey as hoverSelectionPluginKey } from './pm-plugins/hover-selection-plugin';
import { stateKey as tablePluginKey } from './pm-plugins/main';
import {
  createHoverDecorationSet,
  getColumnPos,
  getRowPos,
  getTablePos,
  tableStartPos,
  getCellSelection,
  getTableNode,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
} from './utils';
import { Command } from '../../types';

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

export const hoverColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getColumnPos(column, tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: createHoverDecorationSet(from, to, tableNode, state),
    }),
  );
  return true;
};

export const hoverRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getRowPos(row, tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: createHoverDecorationSet(from, to, tableNode, state),
    }),
  );
  return true;
};

export const hoverTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getTablePos(tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: createHoverDecorationSet(from, to, tableNode, state),
      isTableHovered: true,
    }),
  );
  return true;
};

export const createCellSelection = (from: number, to: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  // here "from" and "to" params are table-relative positions, therefore we add table offset
  const offset = tableStartPos(state);
  const $anchor = state.doc.resolve(from + offset);
  const $head = state.doc.resolve(to + offset);
  dispatch(state.tr.setSelection(new (CellSelection as any)($anchor, $head)));
  return true;
};

export const selectColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getColumnPos(column, tableNode);
  return createCellSelection(from, to)(state, dispatch);
};

export const selectRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getRowPos(row, tableNode);
  return createCellSelection(from, to)(state, dispatch);
};

export const selectTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getTablePos(tableNode);
  return createCellSelection(from, to)(state, dispatch);
};

export const emptySelectedCells: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const cellSelection = getCellSelection(state);
  if (!cellSelection) {
    return false;
  }
  const { tr, schema } = state;
  const emptyCell = schema.nodes.tableCell.createAndFill()!.content;
  cellSelection.forEachCell((cell, pos) => {
    if (!cell.content.eq(emptyCell)) {
      const slice = new Slice(emptyCell, 0, 0);
      tr.replace(
        tr.mapping.map(pos + 1),
        tr.mapping.map(pos + cell.nodeSize - 1),
        slice,
      );
    }
  });
  if (tr.docChanged) {
    dispatch(tr);
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
  const tableNode = getTableNode(state);
  const { tr } = state;
  const map = TableMap.get(tableNode!);
  const { tableHeader, tableCell } = state.schema.nodes;
  const { isNumberColumnEnabled } = tableNode!.attrs;
  const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
  const isHeaderColumnEnabled = checkIfHeaderColumnEnabled(state);
  const type = isHeaderRowEnabled ? tableCell : tableHeader;
  const start = tableStartPos(state);

  for (let column = 0; column < tableNode!.child(0).childCount; column++) {
    // skip header column
    if (
      isHeaderColumnEnabled &&
      ((isNumberColumnEnabled && column === 1) ||
        (!isNumberColumnEnabled && column === 0))
    ) {
      continue;
    }
    const from = tr.mapping.map(start + map.map[column]);
    const cell = tableNode!.child(0).child(column);
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
  const tableNode = getTableNode(state);
  const { tr } = state;
  const start = tableStartPos(state);
  const map = TableMap.get(tableNode!);
  const { tableHeader, tableCell } = state.schema.nodes;
  const type = checkIfHeaderColumnEnabled(state) ? tableCell : tableHeader;

  // skip header row
  const startIndex = checkIfHeaderRowEnabled(state) ? 1 : 0;
  for (let row = startIndex; row < tableNode!.childCount; row++) {
    const column = tableNode!.attrs.isNumberColumnEnabled ? 1 : 0;
    const cell = tableNode!.child(row).child(column);
    tr.setNodeMarkup(
      start + map.map[column + row * map.width],
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
  const start = tableStartPos(state);

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
