import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch, EventDispatcher } from '../../event-dispatcher';
import ExtensionNodeView from './nodeviews/extension';
import { Node as PmNode } from 'prosemirror-model';
import { setExtensionElement } from './actions';
import { ExtensionHandlers } from '../../index';
import { getExtensionNode } from './utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
  focusedNode: PmNode | null;
};

export default (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  eventDispatcher: EventDispatcher,
) =>
  new Plugin({
    state: {
      init: () => ({ element: null, focusedNode: null }),

      apply(tr, state: ExtensionState, prevState, nextState) {
        const meta = tr.getMeta(pluginKey);
        const node = getExtensionNode(nextState);

        let { focusedNode } = state;

        if (meta || node || focusedNode) {
          if (node !== focusedNode) {
            focusedNode = node || null;
          }

          const newState = { ...state, ...meta, focusedNode };

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
