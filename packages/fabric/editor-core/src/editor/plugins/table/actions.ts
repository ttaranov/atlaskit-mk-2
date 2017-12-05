import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { CellSelection } from 'prosemirror-tables';
import { Slice } from 'prosemirror-model';
import { pluginKey as hoverSelectionPluginKey } from './hover-selection-plugin';
import { stateKey as tablePluginKey } from '../../../plugins/table';
import {
  createHoverDecorationSet,
  getColumnPos,
  getRowPos,
  getTablePos,
  tableStartPos,
  getCellSelection,
} from './utils';
import { Command } from '../../';

export const resetHoverSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, { set: DecorationSet.empty }),
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
      set: createHoverDecorationSet(from, to, tableNode, state),
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
      set: createHoverDecorationSet(from, to, tableNode, state),
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
      set: createHoverDecorationSet(from, to, tableNode, state),
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
