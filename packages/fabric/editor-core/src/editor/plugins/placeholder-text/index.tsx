import * as React from 'react';
import { Plugin, NodeSelection, Transaction } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { placeholder } from '@atlaskit/editor-common';
import PlaceholderTextNodeView from '../../../nodeviews/ui/placeholder-text';
import { EditorPlugin } from '../../types/editor-plugin';
import WithPluginState from '../../ui/WithPluginState';
import { Dispatch } from '../../event-dispatcher';
import PlaceholderFloatingToolbar from '../../../ui/PlaceholderFloatingToolbar';
import {
  hidePlaceholderFloatingToolbar,
  insertPlaceholderTextAtSelection,
} from './actions';

export const pluginKey = new PluginKey('placeholderTextPlugin');

export interface PluginState {
  showInsertPanelAt: number | false;
}

export function createPlugin(dispatch: Dispatch): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({ showInsertPanelAt: false } as PluginState),
      apply: (tr: Transaction, state: PluginState) => {
        const meta = tr.getMeta(pluginKey) as PluginState;
        if (meta) {
          const newState = {
            showInsertPanelAt: meta.showInsertPanelAt || false,
          };
          dispatch(pluginKey, newState);
          return newState;
        } else if (state.showInsertPanelAt) {
          const newState = {
            showInsertPanelAt: tr.mapping.map(state.showInsertPanelAt),
          };
          dispatch(pluginKey, newState);
          return newState;
        }
        return state;
      },
    },
    props: {
      nodeViews: {
        placeholder(node, view, getPos) {
          return new PlaceholderTextNodeView(node, view, getPos);
        },
      },
    },
    appendTransaction(transactions, oldState, newState) {
      if (transactions.some(txn => txn.docChanged)) {
        const didPlaceholderExistBeforeTxn =
          oldState.selection.$head.nodeAfter ===
          newState.selection.$head.nodeAfter;
        const wasContentAdded =
          oldState.selection.$head.pos <= newState.selection.$head.pos;
        const adjacentNode = newState.selection.$head.nodeAfter;
        const adjacentNodePos = newState.selection.$head.pos;
        const placeholderNodeType = newState.schema.nodes.placeholder;
        if (
          adjacentNode &&
          adjacentNode.type === placeholderNodeType &&
          didPlaceholderExistBeforeTxn &&
          wasContentAdded
        ) {
          const { $from, $to } = NodeSelection.create(
            newState.doc,
            adjacentNodePos,
          );
          return newState.tr.deleteRange($from.pos, $to.pos);
        }
      }
    },
  });
}

const placeholderTextPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'placeholder', node: placeholder, rank: 1600 }];
  },

  pmPlugins() {
    return [
      {
        rank: 400,
        plugin: ({ schema, props, dispatch }) => createPlugin(dispatch),
      },
    ];
  },

  contentComponent({
    editorView,
    eventDispatcher,
    popupsMountPoint,
    popupsBoundariesElement,
  }) {
    const insertPlaceholderText = (value: string) =>
      insertPlaceholderTextAtSelection(value)(
        editorView.state,
        editorView.dispatch,
      );
    const hidePlaceholderToolbar = () =>
      hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
    const getNodeFromPos = (pos: number) => editorView.domAtPos(pos).node;
    const getFixedCoordinatesFromPos = (pos: number) =>
      editorView.coordsAtPos(pos);
    const setFocusInEditor = () => editorView.focus();
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ placeholderTextState: pluginKey }}
        render={({ placeholderTextState = {} as PluginState }) => {
          if (placeholderTextState.showInsertPanelAt) {
            return (
              <PlaceholderFloatingToolbar
                editorViewDOM={editorView.dom as HTMLElement}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                getFixedCoordinatesFromPos={getFixedCoordinatesFromPos}
                getNodeFromPos={getNodeFromPos}
                hidePlaceholderFloatingToolbar={hidePlaceholderToolbar}
                showInsertPanelAt={placeholderTextState.showInsertPanelAt}
                insertPlaceholder={insertPlaceholderText}
                setFocusInEditor={setFocusInEditor}
              />
            );
          }
          return null;
        }}
      />
    );
  },
};
export default placeholderTextPlugin;
