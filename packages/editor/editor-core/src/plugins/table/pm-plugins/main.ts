import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable, findParentDomRefOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { TableLayout } from '@atlaskit/editor-common';

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
  pluginConfig: PluginConfig;
  tableRef?: HTMLElement;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  editorHasFocus?: boolean;
}

export const stateKey = new PluginKey('tablePlugin');

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
      }),
      apply(
        tr: Transaction,
        pluginState: TablePluginState,
        _,
        state: EditorState,
      ) {
        const nextPluginState = tr.getMeta(stateKey);
        if (nextPluginState) {
          dispatch(stateKey, nextPluginState);
          return nextPluginState;
        }

        if (tr.docChanged) {
          const table = findTable(state.selection);
          const tableNode = table ? table.node : undefined;
          if (pluginState.tableNode !== tableNode) {
            const nextPluginState = { ...pluginState, tableNode };
            dispatch(stateKey, nextPluginState);
            return nextPluginState;
          }
        }

        return pluginState;
      },
    },
    key: stateKey,
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const { selection } = state;
          const pluginState = stateKey.getState(state);

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
            setState({
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
      nodeViews: {
        table: (node: PmNode, view: EditorView, getPos: () => number) => {
          const {
            pluginConfig: { allowColumnResizing },
          } = stateKey.getState(view.state);
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
          setState({ editorHasFocus: false })(state, dispatch);
          event.preventDefault();
          return false;
        },
        focus(view: EditorView, event) {
          const { state, dispatch } = view;
          setState({ editorHasFocus: true })(state, dispatch);
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

export const setState = (stateProps: Object) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const pluginState = stateKey.getState(state);
  const nextPluginState = {
    ...pluginState,
    ...stateProps,
  };
  dispatch(state.tr.setMeta(stateKey, nextPluginState));
  return true;
};
