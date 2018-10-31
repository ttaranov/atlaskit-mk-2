import { EditorState, Transaction } from 'prosemirror-state';
import { findTable, findParentNodeOfType } from 'prosemirror-utils';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import { Dispatch } from '../../event-dispatcher';
import { pluginKey, defaultTableSelection } from './pm-plugins/main';
import { TablePluginState, TableCssClassName as ClassName } from './types';
import { closestElement } from '../../utils';
import { findControlsHoverDecoration } from './utils';

const processDecorations = (
  state: EditorState,
  decorationSet: DecorationSet,
  newDecorations: Decoration[],
  find: (decorationSet: DecorationSet) => Decoration[],
): DecorationSet => {
  if (newDecorations.length) {
    return decorationSet.add(state.doc, newDecorations);
  } else {
    return decorationSet.remove(find(decorationSet));
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
      closestElement(tableRef, `.${ClassName.TABLE_NODE_WRAPPER}`) || undefined,
    tableNode: tableRef ? findTable(state.selection)!.node : undefined,
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
    decorationSet: decorationSet.remove(
      findControlsHoverDecoration(decorationSet),
    ),
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
    decorationSet: processDecorations(
      state,
      pluginState.decorationSet,
      hoverDecoration,
      findControlsHoverDecoration,
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
    decorationSet: processDecorations(
      state,
      pluginState.decorationSet,
      hoverDecoration,
      findControlsHoverDecoration,
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
    decorationSet: processDecorations(
      state,
      pluginState.decorationSet,
      hoverDecoration,
      findControlsHoverDecoration,
    ),
    isTableInDanger,
    isTableHovered: true,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleDocOrSelectionChanged = (tr: Transaction) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  let tableNode;
  let targetCellPosition;
  const table = findTable(tr.selection);
  if (table) {
    tableNode = table.node;
    const { tableCell, tableHeader } = tr.doc.type.schema.nodes;
    const cell = findParentNodeOfType([tableCell, tableHeader])(tr.selection);
    targetCellPosition = cell ? cell.pos : undefined;
  }

  const hoverDecoration = findControlsHoverDecoration(
    pluginState.decorationSet,
  );

  if (
    pluginState.tableNode !== tableNode ||
    pluginState.targetCellPosition !== targetCellPosition ||
    hoverDecoration.length
  ) {
    const nextPluginState = {
      ...pluginState,
      ...defaultTableSelection,
      // @see: https://product-fabric.atlassian.net/browse/ED-3796
      decorationSet: pluginState.decorationSet.remove(hoverDecoration),
      targetCellPosition,
      tableNode,
    };
    dispatch(pluginKey, nextPluginState);
    return nextPluginState;
  }

  return pluginState;
};

export const handleToggleContextualMenu = (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    isContextualMenuOpen: !pluginState.isContextualMenuOpen,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleShowInsertColumnButton = (
  insertColumnButtonIndex?: number,
) => (pluginState: TablePluginState, dispatch: Dispatch): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    insertColumnButtonIndex,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleShowInsertRowButton = (insertRowButtonIndex?: number) => (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    insertRowButtonIndex,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};

export const handleHideInsertColumnOrRowButton = (
  pluginState: TablePluginState,
  dispatch: Dispatch,
): TablePluginState => {
  const nextPluginState = {
    ...pluginState,
    insertColumnButtonIndex: undefined,
    insertRowButtonIndex: undefined,
  };
  dispatch(pluginKey, nextPluginState);
  return nextPluginState;
};
