import {
  Plugin,
  PluginKey,
  EditorState,
  Transaction,
  Selection,
} from 'prosemirror-state';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  columnResizingPluginKey as resizingPluginKey,
  CellSelection,
  TableMap,
} from 'prosemirror-tables';
import {
  isCellSelection,
  findDomRefAtPos,
  removeSelectedColumns,
  removeSelectedRows,
  findParentNodeOfTypeClosestToPos,
  removeColumnClosestToPos,
  removeRowClosestToPos,
  removeColumnAt,
  removeRowAt,
  emptyCell,
  findCellClosestToPos,
  setCellAttrs,
  findTable,
} from 'prosemirror-utils';
import * as getTime from 'date-fns/get_time';
import { Dispatch } from '../../../event-dispatcher';
import { Command } from '../../../types';
import { stateKey as tablePluginKey } from './main';
import { mentionQuery } from '@atlaskit/editor-common';

export type Cell = { pos: number; node: PMNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export const pluginKey = new PluginKey('tableContextualMenuPlugin');

export type PluginState = {
  isOpen: boolean;
  // context menu button is positioned relatively to this DOM node. It is updated on hover over table cells and controls
  targetRef?: HTMLElement;
  // position of a target cell where context menu is drawn
  targetPosition?: number;
  // clicked cell needed to position cellType dropdowns (date, emoji, mention, link)
  clickedCell?: Cell;
};

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init: () => ({ isOpen: false }),

      apply(tr, cur: PluginState): PluginState {
        const nextState = tr.getMeta(pluginKey) as PluginState | undefined;
        if (nextState !== undefined) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        if (tr.docChanged) {
          return mapTargetPosition(cur, tr);
        }

        return cur;
      },
    },
    key: pluginKey,
    view: (view: EditorView) => {
      const domAtPos = view.domAtPos.bind(view);

      return {
        update: (view: EditorView) =>
          updateTargetRefOnRender(domAtPos)(view.state, view.dispatch),
      };
    },
    props: {
      // disable cells with cellType !== "text" from editing
      decorations: (state: EditorState) => createCellTypeDecoration(state),

      handleDOMEvents: {
        click(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          const { tableElement } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (
            !tableElement ||
            isCellSelection(view.state.selection) ||
            !posAtCoords
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          const $pos = state.doc.resolve(posAtCoords.pos);
          const cell = findParentNodeOfTypeClosestToPos($pos, [
            state.schema.nodes.tableCell,
          ]);
          if (
            !cell ||
            ['date', 'link', 'mention', 'checkbox', 'emoji'].indexOf(
              cell.node.attrs.cellType,
            ) === -1
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          return setClickedCell(cell)(state, dispatch);
        },

        mousemove(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          if ((resizingPluginKey.getState(state) || {}).dragging) {
            return setTargetRef(undefined)(state, dispatch);
          }
          const pluginState = pluginKey.getState(state);
          const { tableElement } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (
            !tableElement ||
            pluginState.isOpen ||
            isCellSelection(view.state.selection) ||
            !posAtCoords
          ) {
            return false;
          }
          const { doc, schema } = state;
          const { tableCell, tableHeader } = schema.nodes;
          const $pos = doc.resolve(posAtCoords.pos);
          const cell = findParentNodeOfTypeClosestToPos($pos, [
            tableCell,
            tableHeader,
          ]);
          if (!cell) {
            return false;
          }
          const targetPosition = cell.pos;
          const ref = findDomRefAtPos(targetPosition, view.domAtPos.bind(view));
          const targetRef = !targetPosition ? undefined : ref;
          return setTargetRef(targetRef as HTMLElement, targetPosition)(
            state,
            dispatch,
          );
        },
        blur(view: EditorView, event: MouseEvent) {
          const { state, dispatch } = view;
          return setTargetRef(undefined)(state, dispatch);
        },
      },
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

export const setTargetRef = (
  targetRef?: HTMLElement,
  targetPosition?: number,
): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (
    !targetRef ||
    (!pluginState.isOpen && pluginState.targetRef !== targetRef)
  ) {
    dispatch(
      state.tr.setMeta(pluginKey, {
        ...pluginState,
        targetRef,
        targetPosition,
        isOpen: false,
      }),
    );
    return true;
  }
  return false;
};

export const updateTargetRefOnRender = (domAtPos): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (isCellSelection(state.selection)) {
    // draw contextual menu button when cell selection changes
    const targetRef = findDomRefAtPos(
      (state.selection as any).$headCell.pos + 1,
      domAtPos,
    );
    return setTargetRef(targetRef as HTMLElement)(state, dispatch);
  }
  return false;
};

export const deleteColumn = (columnIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (columnIndex !== null) {
    dispatch(removeColumnAt(columnIndex)(state.tr));
    return true;
  }
  if (isCellSelection(state.selection)) {
    dispatch(removeSelectedColumns(state.tr));
    return true;
  }
  const { targetPosition } = pluginKey.getState(state);
  if (targetPosition) {
    dispatch(
      removeColumnClosestToPos(state.doc.resolve(targetPosition))(state.tr),
    );
    return true;
  }
  return false;
};

export const deleteRow = (rowIndex: number | null): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  if (rowIndex !== null) {
    dispatch(removeRowAt(rowIndex)(state.tr));
    return true;
  }
  if (isCellSelection(state.selection)) {
    dispatch(removeSelectedRows(state.tr));
    return true;
  }
  const { targetPosition } = pluginKey.getState(state);
  if (targetPosition) {
    dispatch(
      removeRowClosestToPos(state.doc.resolve(targetPosition))(state.tr),
    );
    return true;
  }
  return false;
};

export const mapTargetPosition = (
  pluginState: PluginState,
  tr: Transaction,
) => {
  if (typeof pluginState.targetPosition === 'number') {
    const { pos, deleted } = tr.mapping.mapResult(pluginState.targetPosition);
    return { ...pluginState, targetPosition: deleted ? undefined : pos };
  }
  return pluginState;
};

export const emptyCells: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { targetPosition } = pluginKey.getState(state);
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((node, pos) => {
      const $pos = state.doc.resolve(pos + 1);
      tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetPosition))!;
    tr = emptyCell(cell, state.schema)(tr);
    // position directly before the cell
    cursorPos = cell.pos - 1;
  }
  if (tr.docChanged) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
    // searching for a valid cursor pos
    const selection = Selection.findFrom($pos, 1, true);
    if (selection) {
      tr.setSelection(selection);
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
  const { targetPosition } = pluginKey.getState(state);
  let cursorPos;
  let { tr } = state;

  if (isCellSelection(tr.selection)) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((cell, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetPosition))!;
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

export const createCellTypeDecoration = (
  state: EditorState,
): DecorationSet | null => {
  const table = findTable(state.selection);
  if (!table) {
    return null;
  }
  const { pos: start } = table;
  const map = TableMap.get(table.node);
  const set: Decoration[] = [];

  for (let i = 0, rowCount = table.node.childCount; i < rowCount; i++) {
    const row = table.node.child(i);

    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      const pos = start + map.map[i * map.width];

      if (
        ['text', 'currency', 'number', 'mention'].indexOf(
          cell.attrs.cellType,
        ) === -1
      ) {
        set.push(
          Decoration.node(pos, pos + cell.nodeSize, {
            contentEditable: false,
          } as any),
        );
      }

      if (cell.attrs.cellType === 'mention') {
        const paragraph = cell.child(0);
        if (!paragraph || !paragraph.childCount) {
          continue;
        }
        const node = paragraph.child(0);
        if (node && node.type === state.schema.nodes.mention) {
          set.push(
            Decoration.node(pos, pos + cell.nodeSize, {
              contentEditable: false,
            } as any),
          );
        }
      }
    }
  }

  return DecorationSet.create(state.doc, set);
};

export const setClickedCell = (clickedCell?: {
  pos: number;
  node: PMNode;
}): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (pluginState.clickedCell !== clickedCell) {
    let { tr } = state;
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell,
    });

    // insert mention on click on cellType="mention"
    if (clickedCell && clickedCell.node.attrs.cellType === 'mention') {
      const mentionMark = state.schema.mark('mentionQuery', { active: true });
      const mentionQuery = state.schema.text('@', [mentionMark]);
      tr
        .delete(
          clickedCell.pos + 1,
          clickedCell.pos + clickedCell.node.nodeSize + 1,
        )
        .insert(clickedCell.pos + 1, mentionQuery);
    }

    dispatch(tr);
    return true;
  }
  return false;
};

export const setDateIntoClickedCell = (iso: string): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = pluginKey.getState(state);
  const { clickedCell } = pluginState;
  const { tr, schema } = state;
  const dateNode = schema.nodes.date.create({ timestamp: getTime(iso) });
  tr.replaceWith(
    clickedCell.pos + 1,
    clickedCell.pos + clickedCell.node.nodeSize + 1,
    dateNode,
  );

  dispatch(
    tr.setMeta(pluginKey, {
      ...pluginState,
      clickedCell: undefined,
    }),
  );
  return true;
};
