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

export const resetHoverSelection = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, { set: DecorationSet.empty })
  );
};

export const hoverColumn = (
  column: number,
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getColumnPos(column, tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      set: createHoverDecorationSet(from, to, tableNode, state),
    })
  );
};

export const hoverRow = (
  row: number,
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getRowPos(row, tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      set: createHoverDecorationSet(from, to, tableNode, state),
    })
  );
};

export const hoverTable = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getTablePos(tableNode);
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      set: createHoverDecorationSet(from, to, tableNode, state),
    })
  );
};

export const createCellSelection = (
  from: number,
  to: number,
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  // here "from" and "to" params are table-relative positions, therefore we add table offset
  const offset = tableStartPos(state);
  const $anchor = state.doc.resolve(from + offset);
  const $head = state.doc.resolve(to + offset);
  dispatch(state.tr.setSelection(new (CellSelection as any)($anchor, $head)));
};

export const selectColumn = (
  column: number,
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getColumnPos(column, tableNode);
  createCellSelection(from, to, state, dispatch);
};

export const selectRow = (
  row: number,
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getRowPos(row, tableNode);
  createCellSelection(from, to, state, dispatch);
};

export const selectTable = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getTablePos(tableNode);
  createCellSelection(from, to, state, dispatch);
};

export const emptySelectedCells = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
): void => {
  const cellSelection = getCellSelection(state);
  if (!cellSelection) {
    return;
  }
  const { tr, schema } = state;
  const emptyCell = schema.nodes.tableCell.createAndFill()!.content;
  cellSelection.forEachCell((cell, pos) => {
    if (!cell.content.eq(emptyCell)) {
      const slice = new Slice(emptyCell, 0, 0);
      tr.replace(
        tr.mapping.map(pos + 1),
        tr.mapping.map(pos + cell.nodeSize - 1),
        slice
      );
    }
  });
  if (tr.docChanged) {
    dispatch(tr);
  }
};

export const clearSelection = (
  state: EditorState,
  dispatch: (tr: Transaction) => void
) => {
  dispatch(state.tr.setSelection(Selection.near(state.selection.$from)));
};
