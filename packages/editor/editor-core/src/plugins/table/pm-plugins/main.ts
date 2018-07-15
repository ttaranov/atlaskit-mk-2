import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable, findParentDomRefOfType } from 'prosemirror-utils';
import { EditorView, DecorationSet } from 'prosemirror-view';
import { browser, TableLayout } from '@atlaskit/editor-common';

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

export type PermittedLayoutsDescriptor = (TableLayout)[] | 'all';

export interface PluginConfig {
  allowBackgroundColor?: boolean;
  allowColumnResizing?: boolean;
  allowHeaderColumn?: boolean;
  allowHeaderRow?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  isHeaderRowRequired?: boolean;
  stickToolbarToBottom?: boolean;
  permittedLayouts?: PermittedLayoutsDescriptor;
}

export interface TablePluginState {
  hoverDecoration: DecorationSet;
  pluginConfig: PluginConfig;
  editorHasFocus?: boolean;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  tableRef?: HTMLElement;
  isTableHovered?: boolean;
  isTableInDanger?: boolean;
}

export const pluginKey = new PluginKey('tablePlugin');

export const defaultTableSelection = {
  isTableInDanger: false,
  isTableHovered: false,
  hoverDecoration: DecorationSet.empty,
};

const isIE11 = browser.ie_version === 11;

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
) =>
  new Plugin({
    state: {
      init: (): TablePluginState => ({
        pluginConfig,
        ...defaultTableSelection,
      }),
      apply(
        tr: Transaction,
        pluginState: TablePluginState,
        _,
        state: EditorState,
      ) {
        const nextPluginState = tr.getMeta(pluginKey);
        if (nextPluginState) {
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        if (tr.docChanged) {
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
            setPluginState({
              tableRef,
              tableNode: tableRef
                ? findTable(state.selection)!.node
                : undefined,
            })(state, dispatch);
          }
        },
      };
    },
    props: {
      decorations: state => getPluginState(state).hoverDecoration,

      handleClick: ({ state, dispatch }) => {
        if (getPluginState(state).hoverDecoration !== DecorationSet.empty) {
          setPluginState({ ...defaultTableSelection })(state, dispatch);
        }
        return false;
      },

      nodeViews: {
        table: (node: PmNode, view: EditorView, getPos: () => number) => {
          const {
            pluginConfig: { allowColumnResizing },
          } = getPluginState(view.state);
          return new TableNodeView({
            node,
            view,
            allowColumnResizing,
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
            setPluginState({ editorHasFocus: false })(state, dispatch);
          }
          event.preventDefault();
          return false;
        },
        focus(view: EditorView, event) {
          const { state, dispatch } = view;
          setPluginState({ editorHasFocus: true })(state, dispatch);
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

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = getPluginState(state);
  const nextPluginState = {
    ...pluginState,
    ...stateProps,
  };
  dispatch(state.tr.setMeta(pluginKey, nextPluginState));
  return true;
};
