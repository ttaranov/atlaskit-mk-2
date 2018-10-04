import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import {
  findTable,
  findParentDomRefOfType,
  findDomRefAtPos,
} from 'prosemirror-utils';
import { EditorView, DecorationSet } from 'prosemirror-view';
import { browser } from '@atlaskit/editor-common';
import { PluginConfig, TablePluginState } from '../types';
import {
  isElementInTableCell,
  setNodeSelection,
  isLastItemMediaGroup,
  closestElement,
} from '../../../utils/';
import { Dispatch } from '../../../event-dispatcher';
import TableNodeView from '../nodeviews/table';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import {
  setEditorFocus,
  setTargetCell,
  setTableRef,
  clearHoverSelection,
} from '../actions';
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
} from '../action-handlers';
import { findHoverDecoration } from '../utils';

import { getColResizePluginKey } from '../index';

export const pluginKey = new PluginKey('tablePlugin');

export const defaultTableSelection = {
  dangerColumns: [],
  dangerRows: [],
  isTableInDanger: false,
  isTableHovered: false,
};

const isIE11 = browser.ie_version === 11;

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
        pluginState: TablePluginState,
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
        } = data;

        let remappedState = pluginState;

        if (tr.docChanged && pluginState.targetCellPosition) {
          const { pos, deleted } = tr.mapping.mapResult(
            pluginState.targetCellPosition,
          );
          remappedState = {
            ...pluginState,
            targetCellPosition: deleted ? undefined : pos,
          };
        }

        switch (meta.action) {
          case ACTIONS.SET_EDITOR_FOCUS:
            return handleSetFocus(editorHasFocus)(remappedState, dispatch);

          case ACTIONS.SET_TABLE_REF:
            return handleSetTableRef(state, tableRef)(remappedState, dispatch);

          case ACTIONS.SET_TARGET_CELL_REF:
            return handleSetTargetCellRef(targetCellRef)(
              remappedState,
              dispatch,
            );

          case ACTIONS.SET_TARGET_CELL_POSITION:
            return handleSetTargetCellPosition(targetCellPosition)(
              remappedState,
              dispatch,
            );

          case ACTIONS.CLEAR_HOVER_SELECTION:
            return handleClearSelection(remappedState, dispatch);

          case ACTIONS.HOVER_COLUMNS:
            return handleHoverColumns(state, hoverDecoration, dangerColumns)(
              remappedState,
              dispatch,
            );

          case ACTIONS.HOVER_ROWS:
            return handleHoverRows(state, hoverDecoration, dangerRows)(
              remappedState,
              dispatch,
            );

          case ACTIONS.HOVER_TABLE:
            return handleHoverTable(state, hoverDecoration, isTableInDanger)(
              remappedState,
              dispatch,
            );

          case ACTIONS.TOGGLE_CONTEXTUAL_MENU:
            return handleToggleContextualMenu(isContextualMenuOpen)(
              remappedState,
              dispatch,
            );

          default:
            break;
        }

        if (tr.docChanged) {
          return handleDocChanged(state)(remappedState, dispatch);
        } else if (tr.selectionSet) {
          return handleSelectionChanged(state)(remappedState, dispatch);
        }

        return remappedState;
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
        if (findHoverDecoration(decorationSet).length) {
          clearHoverSelection(state, dispatch);
        }
        return false;
      },

      nodeViews: {
        table: (node: PmNode, view: EditorView, getPos: () => number) => {
          const {
            pluginConfig: {
              allowColumnResizing,
              UNSAFE_allowFlexiColumnResizing,
            },
          } = getPluginState(view.state);
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
        blur(view: EditorView, event) {
          const { state, dispatch } = view;
          // fix for issue ED-4665
          if (!isIE11) {
            setEditorFocus(false)(state, dispatch);
          }
          event.preventDefault();
          return false;
        },
        focus(view: EditorView, event) {
          const { state, dispatch } = view;
          setEditorFocus(true)(state, dispatch);
          event.preventDefault();
          return false;
        },
        click(view: EditorView, event) {
          const element = event.target as HTMLElement;
          const table = findTable(view.state.selection)!;

          /**
           * Check if the table cell with an image is clicked
           * and its not the image itself
           */
          const matches = element.matches ? 'matches' : 'msMatchesSelector';
          if (
            !table ||
            !isElementInTableCell(element) ||
            element[matches]('table .image, table p, table .image div')
          ) {
            return false;
          }
          const map = TableMap.get(table.node);

          /** Getting the offset of current item clicked */
          const colElement = (closestElement(element, 'td') ||
            closestElement(element, 'th')) as HTMLTableDataCellElement;
          const colIndex = colElement && colElement.cellIndex;
          const rowElement = closestElement(
            element,
            'tr',
          ) as HTMLTableRowElement;
          const rowIndex = rowElement && rowElement.rowIndex;
          const cellIndex = map.width * rowIndex + colIndex;
          const posInTable = map.map[cellIndex + 1];

          const {
            dispatch,
            state: {
              tr,
              schema: {
                nodes: { paragraph },
              },
            },
          } = view;
          const editorElement = table.node.nodeAt(map.map[cellIndex]) as PmNode;

          /** Only if the last item is media group, insert a paragraph */
          if (isLastItemMediaGroup(editorElement)) {
            tr.insert(posInTable + table.pos, paragraph.create());
            dispatch(tr);
            setNodeSelection(view, posInTable + table.pos);
          }
          return true;
        },
      },
    },
  });

export const getPluginState = (state: EditorState) => {
  return pluginKey.getState(state);
};
