import { Plugin, PluginKey } from 'prosemirror-state';
import { ExtensionNodeView } from '../../../nodeviews';
import ProviderFactory from '../../../providerFactory';
import { Dispatch } from '../../event-dispatcher';

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
    key: pluginKey,
    props: {
      nodeViews: {
        extension: ExtensionNodeView(providerFactory),
        inlineExtension: ExtensionNodeView(providerFactory),
      },
    },
  });
