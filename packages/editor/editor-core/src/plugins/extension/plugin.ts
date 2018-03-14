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
          const { element, focusedNode } = pluginKey.getState(state);
          const node = getExtensionNode(state);

          if (node !== focusedNode) {
            dispatch(state.tr.setMeta(pluginKey, { focusedNode: node }));
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
