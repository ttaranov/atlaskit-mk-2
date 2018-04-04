import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ExtensionProvider } from './types';
import { ProviderFactory } from '@atlaskit/editor-common';
import { setExtensionProvider } from './actions';
import { Dispatch } from '../../event-dispatcher';

export * from './types';
export * from './actions';

export const pluginKey = new PluginKey('macroPlugin');

export type MacroState = {
  extensionProvider: ExtensionProvider | null;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
) =>
  new Plugin({
    state: {
      init: () => ({ extensionProvider: null }),

      apply(tr, state: MacroState) {
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
    view: (view: EditorView) => {
      // make sure editable DOM node is mounted
      if (view.dom.parentNode) {
        providerFactory.subscribe(
          'extensionProvider',
          (name, provider: Promise<ExtensionProvider>) =>
            setExtensionProvider(provider)(view),
        );
      }
      return {};
    },
  });

export default {
  pmPlugins() {
    return [
      {
        rank: 2310,
        plugin: ({ dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
};
