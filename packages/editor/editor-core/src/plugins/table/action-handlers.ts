import { EditorState } from 'prosemirror-state';
import { findTable, findParentNodeOfType } from 'prosemirror-utils';
import { DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { Dispatch } from '../../event-dispatcher';
import { pluginKey, defaultTableSelection } from './pm-plugins/main';
import { TablePluginState } from './types';
import { closestElement } from '../../utils';

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
  const nextPluginState = {
    ...pluginState,
    ...defaultTableSelection,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverColumns = (
  state: EditorState,
  hoverDecoration: DecorationSet,
  dangerColumns: number[],
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const table = findTable(state.selection)!;
  const map = TableMap.get(table.node);

  const nextPluginState = {
    ...pluginState,
    hoverDecoration,
    dangerColumns,
    isTableInDanger: map.width === dangerColumns.length ? true : false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverRows = (
  state: EditorState,
  hoverDecoration: DecorationSet,
  dangerRows: number[],
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const table = findTable(state.selection)!;
  const map = TableMap.get(table.node);

  const nextPluginState = {
    ...pluginState,
    hoverDecoration,
    dangerRows,
    isTableInDanger: map.height === dangerRows.length ? true : false,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHoverTable = (
  hoverDecoration: DecorationSet,
  isTableInDanger: boolean,
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    hoverDecoration,
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
  if (
    pluginState.tableNode !== tableNode ||
    pluginState.hoverDecoration !== DecorationSet.empty
  ) {
    const nextPluginState = {
      ...pluginState,
      // @see: https://product-fabric.atlassian.net/browse/ED-3796
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
