import { EditorState } from 'prosemirror-state';
import { findTable, findParentNodeOfType } from 'prosemirror-utils';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { Dispatch } from '../../event-dispatcher';
import { pluginKey, defaultTableSelection } from './pm-plugins/main';
import { TablePluginState } from './types';
import { closestElement } from '../../utils';
import { findHoverDecoration } from './utils';

const processHoverDecoration = (
  state: EditorState,
  hoverDecoration: Decoration[],
  decorationSet: DecorationSet,
): DecorationSet => {
  if (hoverDecoration.length) {
    return decorationSet.add(state.doc, hoverDecoration);
  } else {
    return decorationSet.remove(findHoverDecoration(decorationSet));
  }
};

export const handleSetFocus = (editorHasFocus: boolean) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    editorHasFocus,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleSetTableRef = (
  state: EditorState,
  tableRef?: HTMLElement,
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    tableRef,
    tableFloatingToolbarTarget:
      closestElement(tableRef, '.table-wrapper') || undefined,
    tableNode: tableRef ? findTable(state.selection)!.node : undefined,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleSetTargetCellRef = (targetCellRef?: HTMLElement) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  // If our target isn't an element (e.g. text node), we don't want to use it.
  // Since we need bounding information etc.
  if (targetCellRef && !(targetCellRef instanceof HTMLTableCellElement)) {
    targetCellRef = undefined;
  }

  const nextPluginState = {
    ...pluginState,
    targetCellRef,
    isContextualMenuOpen: false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleSetTargetCellPosition = (targetCellPosition?: number) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    targetCellPosition,
    isContextualMenuOpen: false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleClearSelection = (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const { decorationSet } = pluginState;
  const nextPluginState = {
    ...pluginState,
    ...defaultTableSelection,
    decorationSet: decorationSet.remove(findHoverDecoration(decorationSet)),
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverColumns = (
  state: EditorState,
  hoverDecoration: Decoration[],
  dangerColumns: number[],
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const table = findTable(state.selection)!;
  const map = TableMap.get(table.node);

  const nextPluginState = {
    ...pluginState,
    decorationSet: processHoverDecoration(
      state,
      hoverDecoration,
      pluginState.decorationSet,
    ),
    dangerColumns,
    isTableInDanger: map.width === dangerColumns.length ? true : false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverRows = (
  state: EditorState,
  hoverDecoration: Decoration[],
  dangerRows: number[],
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const table = findTable(state.selection)!;
  const map = TableMap.get(table.node);

  const nextPluginState = {
    ...pluginState,
    decorationSet: processHoverDecoration(
      state,
      hoverDecoration,
      pluginState.decorationSet,
    ),
    dangerRows,
    isTableInDanger: map.height === dangerRows.length ? true : false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverTable = (
  state: EditorState,
  hoverDecoration: Decoration[],
  isTableInDanger: boolean,
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    decorationSet: processHoverDecoration(
      state,
      hoverDecoration,
      pluginState.decorationSet,
    ),
    isTableInDanger,
    isTableHovered: true,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleDocChanged = (state: EditorState) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const table = findTable(state.selection);
  const tableNode = table ? table.node : undefined;
  const { decorationSet } = pluginState;
  const hoverDecoration = findHoverDecoration(decorationSet);
  if (pluginState.tableNode !== tableNode || hoverDecoration.length) {
    const { decorationSet } = pluginState;
    const nextPluginState = {
      ...pluginState,
      // @see: https://product-fabric.atlassian.net/browse/ED-3796
      decorationSet: decorationSet.remove(hoverDecoration),
      ...defaultTableSelection,
      tableNode,
    };
    dispatch(pluginKey, nextPluginState);
    return nextPluginState;
  }

  return pluginState;
};

export const handleSelectionChanged = (state: EditorState) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const { tableCell, tableHeader } = state.schema.nodes;
  const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection);
  const targetCellPosition = cell ? cell.pos : undefined;
  if (pluginState.targetCellPosition !== targetCellPosition) {
    const nextPluginState = {
      ...pluginState,
      targetCellPosition,
    };
    dispatch(pluginKey, nextPluginState);
    return nextPluginState;
  }

  return pluginState;
};

export const handleToggleContextualMenu = (isContextualMenuOpen: boolean) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    isContextualMenuOpen,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};
