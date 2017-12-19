import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MacroProvider } from './types';
import { ProviderFactory } from '@atlaskit/editor-common';
import { setMacroProvider } from './actions';
import { Dispatch } from '../../event-dispatcher';

export * from './types';
export * from './actions';

export const pluginKey = new PluginKey('macroPlugin');

export type MacroState = {
  macroProvider: MacroProvider | null;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
) =>
  new Plugin({
    state: {
      init: () => ({ macroProvider: null }),

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
        const { state, dispatch } = view;
        providerFactory.subscribe(
          'macroProvider',
          (name, provider: Promise<MacroProvider>) =>
            setMacroProvider(provider)(state, dispatch),
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
