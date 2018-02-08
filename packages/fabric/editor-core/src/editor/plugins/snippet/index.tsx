import * as React from 'react';
import { Plugin, Transaction, NodeSelection } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { snippet, snippetQuery } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types/editor-plugin';
import { inputRules } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { createInputRule } from '../../../plugins/utils';
import WithPluginState from '../../ui/WithPluginState/index';
import FloatingSnippetPanel from './ui';
import { Dispatch } from '../../event-dispatcher';
import { insertSnippet } from './actions';
import SnippetNodeView from './SnippetNodeView';
import { getSnippetById } from './ui/data';
import { SnippetProvider } from './provider';

export const pluginKey = new PluginKey('snippetPlugin');

export interface PluginState {
  showSnippetPanelAt?: number | null;
}

const PROVIDER = new SnippetProvider();

export function createPlugin(
  dispatch: Dispatch<PluginState>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({ showSnippetPanelAt: null } as PluginState),
      apply: (tr: Transaction, state: PluginState) => {
        const meta = tr.getMeta(pluginKey) as PluginState;
        if (meta && meta.showSnippetPanelAt !== undefined) {
          const newState = {
            showSnippetPanelAt: meta.showSnippetPanelAt || null,
          };
          dispatch(pluginKey, newState);
          return newState;
        } else if (state.showSnippetPanelAt) {
          const newState = {
            showSnippetPanelAt: tr.mapping.map(state.showSnippetPanelAt),
          } as PluginState;
          // if (!tr.doc.rangeHasMark(newState.showSnippetPanelAt!-1, newState.showSnippetPanelAt!, tr.doc.type.schema.marks.snippetQuery)) {
          //   newState.showSnippetPanelAt = null;
          // }
          dispatch(pluginKey, newState);
          return newState;
        }
        return state;
      },
    },
    appendTransaction(trs, oldState, newState) {
      if (!trs.some(tr => tr.docChanged)) return;
      const { snippetQuery } = newState.schema.marks;
      if (
        newState.selection.empty &&
        newState.storedMarks &&
        snippetQuery.isInSet(newState.storedMarks)
      ) {
        return newState.tr
          .removeStoredMark(newState.schema.marks.snippetQuery)
          .setMeta(pluginKey, { showSnippetPanelAt: null });
      }
    },
    props: {
      nodeViews: {
        snippet: (node, view, getPos) =>
          new SnippetNodeView(node, view, getPos, (id: string) =>
            PROVIDER.get(id),
          ),
      },
    },
  });
}

export function inputRulePlugin(schema: Schema): Plugin {
  const snippetQueryRule = createInputRule(
    /(^|\s)(=)$/,
    (state, match, start, end) => {
      const mark = schema.mark('snippetQuery');
      if (!state.selection.empty) {
        const tr = state.tr;
        tr.replaceSelectionWith(schema.text('=', [mark]));
        tr.setMeta(pluginKey, { showSnippetPanelAt: tr.selection.head });
        return tr;
      }
      return state.tr
        .replaceRangeWith(end, end, schema.text('=', [mark]))
        .setMeta(pluginKey, { showSnippetPanelAt: end });
    },
  );
  const snippetQueryRuleCleanup = createInputRule(
    /(^|\s)(=)(.*?)\s\s$/,
    (state, match, start, end) => {
      const maybeSnippet = NodeSelection.create(
        state.doc,
        match[1].length ? start + 1 : start,
      );
      if (state.schema.marks.snippetQuery.isInSet(maybeSnippet.node.marks)) {
        return state.tr
          .replaceRangeWith(
            maybeSnippet.from,
            maybeSnippet.to,
            maybeSnippet.node.mark([]),
          )
          .setMeta(pluginKey, { showSnippetPanelAt: null });
      }
    },
  );
  return inputRules({
    rules: [snippetQueryRule, snippetQueryRuleCleanup],
  });
}

const snippetPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'snippet', node: snippet, rank: 1600 }];
  },
  marks() {
    return [{ name: 'snippetQuery', mark: snippetQuery, rank: 1600 }];
  },
  pmPlugins() {
    return [
      {
        rank: 400,
        plugin: ({ schema, props, dispatch }) => createPlugin(dispatch),
      },
      {
        rank: 420,
        plugin: ({ schema, props, dispatch }) => inputRulePlugin(schema),
      },
    ];
  },
  contentComponent({
    editorView,
    eventDispatcher,
    popupsMountPoint,
    popupsBoundariesElement,
  }) {
    const getNodeFromPos = (pos: number) => editorView.domAtPos(pos).node;
    const getFixedCoordinatesFromPos = (pos: number) =>
      editorView.coordsAtPos(pos);
    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ snippetState: pluginKey }}
        render={({ snippetState = {} as PluginState }) => {
          const queryNode =
            snippetState.showSnippetPanelAt &&
            editorView.state.doc.nodeAt(snippetState.showSnippetPanelAt);
          if (queryNode) {
            const query = queryNode.textContent.slice(1);
            return (
              <FloatingSnippetPanel
                editorViewDOM={editorView.dom as HTMLElement}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                getFixedCoordinatesFromPos={getFixedCoordinatesFromPos}
                getNodeFromPos={getNodeFromPos}
                showSnippetPanelAt={snippetState.showSnippetPanelAt!}
                searchFilter={query}
                onSnippetSelected={id =>
                  insertSnippet(id)(editorView.state, editorView.dispatch)
                }
                getListOfSnippets={(arg: string) => PROVIDER.search(arg)}
              />
            );
          }
          return null;
        }}
      />
    );
  },
};
export default snippetPlugin;
