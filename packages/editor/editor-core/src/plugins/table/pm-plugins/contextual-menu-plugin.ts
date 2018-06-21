import {
  Plugin,
  PluginKey,
  EditorState,
  Transaction,
  Selection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  TableMap,
  CellSelection,
  columnResizingPluginKey as resizingPluginKey,
} from 'prosemirror-tables';
import {
  isCellSelection,
  findDomRefAtPos,
  removeSelectedColumns,
  removeSelectedRows,
  findParentNodeOfType,
  removeColumnClosestToPos,
  removeRowClosestToPos,
  removeColumnAt,
  removeRowAt,
  emptyCell,
  findCellClosestToPos,
  setCellAttrs,
  setTextSelection,
} from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';
import { Command } from '../../../types';

export type Cell = { pos: number; node: PMNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export const pluginKey = new PluginKey('tableContextualMenuPlugin');

export type ContextualMenuPluginState = {
  isOpen: boolean;
  // context menu button is positioned relatively to this DOM node. It is updated on hover over table cells and controls
  targetCellRef?: HTMLElement;
  targetCellPosition?: number;
};

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init: () => ({ isOpen: false }),

      apply(tr: Transaction, pluginState: ContextualMenuPluginState) {
        const nextPluginState = tr.getMeta(pluginKey);
        if (nextPluginState !== undefined) {
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        if (tr.docChanged) {
          return mapTargetCellPosition(pluginState, tr);
        }

        return pluginState;
      },
    },
    key: pluginKey,

    view: (view: EditorView) => {
      const domAtPos = view.domAtPos.bind(view);
      // const posAtDOM = (view as any).posAtDOM.bind(view);

      return {
        update: (view: EditorView) => {
          const { state } = view;
          const pluginState = pluginKey.getState(state);
          const targetCellPosition = getTargetCellPosition(state);
          const dragging = (resizingPluginKey.getState(state) || {}).dragging;
          const targetCellRef =
            view.hasFocus() && !dragging && targetCellPosition
              ? findDomRefAtPos(targetCellPosition, domAtPos)
              : undefined;

          if (pluginState.targetCellRef !== targetCellRef) {
            view.dispatch(
              state.tr.setMeta(pluginKey, {
                ...pluginState,
                targetCellRef,
                targetCellPosition,
                isOpen: false,
              }),
            );
            return true;
          }

          return false;
        },
      };
    },
  });

export default createPlugin;

export const toggleContextualMenu = (isOpen: boolean): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  dispatch(state.tr.setMeta(pluginKey, { ...pluginState, isOpen }));
  return true;
};

export const mapTargetCellPosition = (
  pluginState: ContextualMenuPluginState,
  tr: Transaction,
) => {
  if (typeof pluginState.targetCellPosition === 'number') {
    const { pos, deleted } = tr.mapping.mapResult(
      pluginState.targetCellPosition,
    );
    return { ...pluginState, targetCellPosition: deleted ? undefined : pos };
  }
  return pluginState;
};

export const deleteColumn = (columnIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetCellPosition } = pluginKey.getState(state);
  let { tr } = state;
  if (isCellSelection(state.selection)) {
    tr = removeSelectedColumns(tr);
  } else if (columnIndex !== null) {
    tr = removeColumnAt(columnIndex)(tr);
  } else if (targetCellPosition) {
    tr = removeColumnClosestToPos(state.doc.resolve(targetCellPosition))(tr);
  }
  if (tr.docChanged) {
    dispatch(setTextSelection(tr.selection.$from.pos)(tr));
    return true;
  }

  return false;
};

export const deleteRow = (rowIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetCellPosition } = pluginKey.getState(state);
  let { tr } = state;
  if (isCellSelection(state.selection)) {
    tr = removeSelectedRows(tr);
  } else if (rowIndex !== null) {
    tr = removeRowAt(rowIndex)(tr);
  } else if (targetCellPosition) {
    tr = removeRowClosestToPos(state.doc.resolve(targetCellPosition))(tr);
  }
  if (tr.docChanged) {
    dispatch(setTextSelection(tr.selection.$from.pos)(tr));
    return true;
  }

  return false;
};

export const emptyCells: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetCellPosition } = pluginKey.getState(state);
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
    const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition))!;
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

export const setCellsAttrs = (attrs: Object): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetCellPosition } = pluginKey.getState(state);
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

export const getTargetCellPosition = (state: EditorState): number => {
  const { tableCell, tableHeader } = state.schema.nodes;
  let cellPos;
  if (isCellSelection(state.selection)) {
    const selection = state.selection as any;
    const { $anchorCell, $headCell } = selection;
    if (selection.isRowSelection() || selection.isColSelection()) {
      const table = $anchorCell.node(-1);
      const start = $anchorCell.start(-1);
      const map = TableMap.get(table);
      const cells = map.cellsInRect(
        map.rectBetween($anchorCell.pos - start, $headCell.pos - start),
      );
      cellPos = cells[0] + start;
    } else {
      cellPos = $headCell.pos;
    }
  } else {
    const cell = findParentNodeOfType([tableCell, tableHeader])(
      state.selection,
    );
    cellPos = cell ? cell.pos : undefined;
  }
  return cellPos;
};
