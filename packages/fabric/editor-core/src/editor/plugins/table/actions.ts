import { pluginKey as hoverSelectionPluginKey } from './hover-selection-plugin';
import { stateKey as tablePluginKey } from '../../../plugins/table';
import { EditorState, Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

import {
  getColumnPos,
  getRowPos,
  getTablePos
} from '../../../plugins/table/utils';
import { createHoverDecorationSet } from './utils';

export const resetHoverSelection = (state: EditorState, dispatch: (tr: Transaction) => void): void => {
  dispatch(state.tr.setMeta(hoverSelectionPluginKey, { set: DecorationSet.empty }));
};

export const hoverColumn = (column: number, state: EditorState, dispatch: (tr: Transaction) => void): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getColumnPos(column, tableNode);
  dispatch(state.tr.setMeta(hoverSelectionPluginKey, { set: createHoverDecorationSet(from, to, tableNode, state) }));
};

export const hoverRow = (row: number, state: EditorState, dispatch: (tr: Transaction) => void): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getRowPos(row, tableNode);
  dispatch(state.tr.setMeta(hoverSelectionPluginKey, { set: createHoverDecorationSet(from, to, tableNode, state) }));
};

export const hoverTable = (state: EditorState, dispatch: (tr: Transaction) => void): void => {
  const { tableNode } = tablePluginKey.getState(state);
  const { from, to } = getTablePos(tableNode);
  dispatch(state.tr.setMeta(hoverSelectionPluginKey, { set: createHoverDecorationSet(from, to, tableNode, state) }));
};
