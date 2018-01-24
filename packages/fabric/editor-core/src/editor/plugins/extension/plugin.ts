import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { ExtensionNodeView } from '../../../nodeviews';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch } from '../../event-dispatcher';
import { setExtensionElement } from './actions';
import { getExtensionNode, createEditMenuDecoration } from './utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
  set: DecorationSet;
  view?: EditorView;
};

const handleStateChange = (prevState: ExtensionState, action) => {
  const state = { ...prevState, ...action };
  const { element, view } = state;
  if (element !== prevState.element) {
    state.set = createEditMenuDecoration(element, view);
  }
  return state;
};

export default (dispatch: Dispatch, providerFactory: ProviderFactory) =>
  new Plugin({
    state: {
      init: () => ({ element: null, set: DecorationSet.empty }),

      apply(tr, prevState: ExtensionState) {
        const action = tr.getMeta(pluginKey);
        if (action) {
          return handleStateChange(prevState, action);
        }

        return prevState;
      },
    },
    view: () => {
      return {
        update: (editorView: EditorView) => {
          const { state, dispatch } = editorView;
          const { element, view } = pluginKey.getState(state);
          if (!view) {
            editorView.dispatch(
              state.tr.setMeta(pluginKey, { view: editorView }),
            );
          }

          if (
            element &&
            (!document.contains(element) || !getExtensionNode(state))
          ) {
            setExtensionElement(null)(state, dispatch);
          }
        },
      };
    },
    key: pluginKey,
    props: {
      decorations: (state: EditorState) => pluginKey.getState(state).set,

      nodeViews: {
        extension: ExtensionNodeView(providerFactory),
        bodiedExtension: ExtensionNodeView(providerFactory),
        inlineExtension: ExtensionNodeView(providerFactory),
      },
    },
  });
