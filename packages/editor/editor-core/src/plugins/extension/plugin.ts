import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch } from '../../event-dispatcher';
import ExtensionNodeView from './nodeviews/extension';
import { setExtensionElement } from './actions';
import { ExtensionHandlers } from '../../index';
import { getExtensionNode } from './utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
};

export default (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
) =>
  new Plugin({
    state: {
      init: () => ({ element: null }),

      apply(tr, state: ExtensionState, prevState, nextState) {
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
            (!document.body.contains(element) || !getExtensionNode(state))
          ) {
            setExtensionElement(null)(state, dispatch);
          }
        },
      };
    },
    key: pluginKey,
    props: {
      nodeViews: {
        extension: ExtensionNodeView(providerFactory, extensionHandlers),
        bodiedExtension: ExtensionNodeView(providerFactory, extensionHandlers),
        inlineExtension: ExtensionNodeView(providerFactory, extensionHandlers),
      },
    },
  });
