import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { findParentDomRefOfType, findDomRefAtPos } from 'prosemirror-utils';
import { EditorView, DecorationSet } from 'prosemirror-view';
import { PluginConfig, TablePluginState } from '../types';

import { Dispatch } from '../../../event-dispatcher';
import TableNodeView from '../nodeviews/table';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { setTargetCell, setTableRef, clearHoverSelection } from '../actions';
import {
  handleSetFocus,
  handleSetTableRef,
  handleSetTargetCellRef,
  handleSetTargetCellPosition,
  handleClearSelection,
  handleHoverColumns,
  handleHoverRows,
  handleHoverTable,
  handleDocChanged,
  handleSelectionChanged,
  handleToggleContextualMenu,
  handleShowInsertLine,
  handleHideInsertLine,
} from '../action-handlers';
import {
  handleMouseOver,
  handleMouseLeave,
  handleBlur,
  handleFocus,
  handleClick,
} from '../event-handlers';
import { findControlsHoverDecoration } from '../utils';
import {
  getColResizePluginKey,
  pluginConfig as getPluginConfig,
} from '../index';

export const pluginKey = new PluginKey('tablePlugin');

export const defaultTableSelection = {
  dangerColumns: [],
  dangerRows: [],
  isTableInDanger: false,
  isTableHovered: false,
};

export enum ACTIONS {
  SET_EDITOR_FOCUS,
  SET_TABLE_REF,
  SET_TARGET_CELL_REF,
  SET_TARGET_CELL_POSITION,
  CLEAR_HOVER_SELECTION,
  HOVER_COLUMNS,
  HOVER_ROWS,
  HOVER_TABLE,
  TOGGLE_CONTEXTUAL_MENU,
  SHOW_COLUMN_INSERT_LINE,
  SHOW_ROW_INSERT_LINE,
  HIDE_INSERT_LINE,
}

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
) =>
  new Plugin({
    state: {
      init: (): TablePluginState => {
        return {
          pluginConfig,
          decorationSet: DecorationSet.empty,
          ...defaultTableSelection,
        };
      },
      apply(
        tr: Transaction,
        _pluginState: TablePluginState,
        _,
        state: EditorState,
      ) {
        const meta = tr.getMeta(pluginKey) || {};
        const data = meta.data || {};
        const {
          editorHasFocus,
          tableRef,
          targetCellRef,
          targetCellPosition,
          hoverDecoration,
          dangerColumns,
          dangerRows,
          isTableInDanger,
          isContextualMenuOpen,
          insertLineDecoration,
          insertLineIndex,
        } = data;

        let pluginState = { ..._pluginState };

        if (tr.docChanged && pluginState.targetCellPosition) {
          const { pos, deleted } = tr.mapping.mapResult(
            pluginState.targetCellPosition,
          );
          pluginState = {
            ...pluginState,
            targetCellPosition: deleted ? undefined : pos,
          };
        }

        switch (meta.action) {
          case ACTIONS.SET_EDITOR_FOCUS:
            return handleSetFocus(editorHasFocus)(pluginState, dispatch);

          case ACTIONS.SET_TABLE_REF:
            return handleSetTableRef(state, tableRef)(pluginState, dispatch);

          case ACTIONS.SET_TARGET_CELL_REF:
            return handleSetTargetCellRef(targetCellRef)(pluginState, dispatch);

          case ACTIONS.SET_TARGET_CELL_POSITION:
            return handleSetTargetCellPosition(targetCellPosition)(
              pluginState,
              dispatch,
            );

          case ACTIONS.CLEAR_HOVER_SELECTION:
            return handleClearSelection(pluginState, dispatch);

          case ACTIONS.HOVER_COLUMNS:
            return handleHoverColumns(state, hoverDecoration, dangerColumns)(
              pluginState,
              dispatch,
            );

          case ACTIONS.HOVER_ROWS:
            return handleHoverRows(state, hoverDecoration, dangerRows)(
              pluginState,
              dispatch,
            );

          case ACTIONS.HOVER_TABLE:
            return handleHoverTable(state, hoverDecoration, isTableInDanger)(
              pluginState,
              dispatch,
            );

          case ACTIONS.TOGGLE_CONTEXTUAL_MENU:
            return handleToggleContextualMenu(isContextualMenuOpen)(
              pluginState,
              dispatch,
            );

          case ACTIONS.SHOW_COLUMN_INSERT_LINE:
          case ACTIONS.SHOW_ROW_INSERT_LINE:
            return handleShowInsertLine(insertLineDecoration, insertLineIndex)(
              state,
              pluginState,
              dispatch,
            );

          case ACTIONS.HIDE_INSERT_LINE:
            return handleHideInsertLine(pluginState, dispatch);

          default:
            break;
        }

        if (tr.docChanged) {
          return handleDocChanged(tr)(pluginState, dispatch);
        } else if (tr.selectionSet) {
          return handleSelectionChanged(state)(pluginState, dispatch);
        }

        return pluginState;
      },
    },
    key: pluginKey,
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const { selection } = state;
          const pluginState = getPluginState(state);
          const { editorHasFocus, targetCellPosition } = pluginState;
          let tableRef;
          if (editorHasFocus) {
            const parent = findParentDomRefOfType(
              state.schema.nodes.table,
              domAtPos,
            )(selection);
            if (parent) {
              tableRef = (parent as HTMLElement).querySelector('table');
            }
          }
          if (pluginState.tableRef !== tableRef) {
            setTableRef(tableRef)(state, dispatch);
          }

          const dragging = (
            getColResizePluginKey(pluginConfig).getState(state) || {}
          ).dragging;
          const targetCellRef =
            editorHasFocus && tableRef && !dragging && targetCellPosition
              ? (findDomRefAtPos(targetCellPosition, domAtPos) as HTMLElement)
              : undefined;

          if (pluginState.targetCellRef !== targetCellRef) {
            setTargetCell(targetCellRef)(state, dispatch);
          }
        },
      };
    },
    props: {
      decorations: state => getPluginState(state).decorationSet,

      handleClick: ({ state, dispatch }) => {
        const { decorationSet } = getPluginState(state);
        if (findControlsHoverDecoration(decorationSet).length) {
          clearHoverSelection(state, dispatch);
        }
        return false;
      },

      nodeViews: {
        table: (node: PmNode, view: EditorView, getPos: () => number) => {
          const { pluginConfig } = getPluginState(view.state);
          const {
            allowColumnResizing,
            UNSAFE_allowFlexiColumnResizing,
          } = getPluginConfig(pluginConfig);
          return new TableNodeView({
            node,
            view,
            allowColumnResizing,
            UNSAFE_allowFlexiColumnResizing,
            eventDispatcher,
            portalProviderAPI,
            getPos,
          }).init();
        },
      },
      handleDOMEvents: {
        blur: handleBlur,
        focus: handleFocus,
        mouseover: handleMouseOver,
        mouseleave: handleMouseLeave,
        click: handleClick,
      },
    },
  });

export const getPluginState = (state: EditorState) => {
  return pluginKey.getState(state);
};
