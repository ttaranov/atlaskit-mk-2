import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ExtensionNodeView } from '../../../nodeviews';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch, EventDispatcher } from '../../event-dispatcher';
import { setExtensionElement } from './actions';
import { getExtensionNode } from './utils';
import { ExtensionHandlers } from '../../../editor/types';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
};

export default (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  eventDispatcher: EventDispatcher,
) => {
  return new Plugin({
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
        extension: ExtensionNodeView(
          providerFactory,
          extensionHandlers,
          eventDispatcher,
        ),
        bodiedExtension: ExtensionNodeView(
          providerFactory,
          extensionHandlers,
          eventDispatcher,
        ),
        inlineExtension: ExtensionNodeView(
          providerFactory,
          extensionHandlers,
          eventDispatcher,
        ),
      },
    },
  });
};
