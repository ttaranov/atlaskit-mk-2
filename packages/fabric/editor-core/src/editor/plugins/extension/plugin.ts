import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ExtensionNodeView } from '../../../nodeviews';
import ProviderFactory from '../../../providerFactory';
import { Dispatch } from '../../event-dispatcher';
import { setExtensionElement } from './actions';
import { getExtensionNode } from './utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
};

export default (dispatch: Dispatch, providerFactory: ProviderFactory) =>
  new Plugin({
    state: {
      init: () => ({ element: null }),

      apply(tr, state: ExtensionState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const newState = { ...state, ...meta };
          dispatch(pluginKey, newState);

          return newState;
        }

        return state;
      },
    },
    view: () => {
      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const { element } = pluginKey.getState(state);
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
      nodeViews: {
        extension: ExtensionNodeView(providerFactory),
        inlineExtension: ExtensionNodeView(providerFactory),
      },
    },
  });
