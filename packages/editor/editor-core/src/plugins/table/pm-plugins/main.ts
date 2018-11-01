import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { findParentDomRefOfType } from 'prosemirror-utils';
import { EditorView, DecorationSet } from 'prosemirror-view';
import { PluginConfig, TablePluginState } from '../types';
import { Dispatch } from '../../../event-dispatcher';
import { createTableView } from '../nodeviews/table';
import { createCellView } from '../nodeviews/cell';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { setTableRef, clearHoverSelection, handleCut } from '../actions';
import {
  handleSetFocus,
  handleSetTableRef,
  handleSetTargetCellPosition,
  handleClearSelection,
  handleHoverColumns,
  handleHoverRows,
  handleHoverTable,
  handleDocOrSelectionChanged,
  handleToggleContextualMenu,
  handleShowInsertColumnButton,
  handleShowInsertRowButton,
  handleHideInsertColumnOrRowButton,
} from '../action-handlers';
import {
  handleMouseDown,
  handleMouseOver,
  handleMouseLeave,
  handleBlur,
  handleFocus,
  handleClick,
  handleTripleClick,
} from '../event-handlers';
import { findControlsHoverDecoration } from '../utils';

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
  SET_TARGET_CELL_POSITION,
  CLEAR_HOVER_SELECTION,
  HOVER_COLUMNS,
  HOVER_ROWS,
  HOVER_TABLE,
  TOGGLE_CONTEXTUAL_MENU,
  SHOW_INSERT_COLUMN_BUTTON,
  SHOW_INSERT_ROW_BUTTON,
  HIDE_INSERT_COLUMN_OR_ROW_BUTTON,
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
          insertColumnButtonIndex: undefined,
          insertRowButtonIndex: undefined,
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
          targetCellPosition,
          hoverDecoration,
          dangerColumns,
          dangerRows,
          isTableInDanger,
          insertColumnButtonIndex,
          insertRowButtonIndex,
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
            return handleToggleContextualMenu(pluginState, dispatch);

          case ACTIONS.SHOW_INSERT_COLUMN_BUTTON:
            return handleShowInsertColumnButton(insertColumnButtonIndex)(
              pluginState,
              dispatch,
            );

          case ACTIONS.SHOW_INSERT_ROW_BUTTON:
            return handleShowInsertRowButton(insertRowButtonIndex)(
              pluginState,
              dispatch,
            );

          case ACTIONS.HIDE_INSERT_COLUMN_OR_ROW_BUTTON:
            return handleHideInsertColumnOrRowButton(pluginState, dispatch);

          default:
            break;
        }

        if (tr.docChanged || tr.selectionSet) {
          return handleDocOrSelectionChanged(tr)(pluginState, dispatch);
        }

        return pluginState;
      },
    },
    key: pluginKey,
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const tr = transactions.find(tr => tr.getMeta('uiEvent') === 'cut');
      if (tr) {
        return handleCut(tr, oldState, newState);
      }
    },
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const { selection } = state;
          const pluginState = getPluginState(state);
          let tableRef;
          if (pluginState.editorHasFocus) {
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
        table: createTableView(portalProviderAPI),
        tableCell: createCellView(portalProviderAPI),
        tableHeader: createCellView(portalProviderAPI),
      },

      handleDOMEvents: {
        blur: handleBlur,
        focus: handleFocus,
        mousedown: handleMouseDown,
        mouseover: handleMouseOver,
        mouseleave: handleMouseLeave,
        click: handleClick,
      },

      handleTripleClick,
    },
  });

export const getPluginState = (state: EditorState) => {
  return pluginKey.getState(state);
};
