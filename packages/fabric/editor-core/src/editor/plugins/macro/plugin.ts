import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { nodeViewFactory, MacroNode } from '../../../nodeviews';
import { MacroProvider } from './types';
import ProviderFactory from '../../../providerFactory';
import { setMacroProvider } from './actions';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('macroPlugin');

export type MacroState = {
  macroProvider: MacroProvider | null;
  macroElement: HTMLElement | null;
};

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
) =>
  new Plugin({
    state: {
      init: () => ({ macroProvider: null, macroElement: null }),

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
    props: {
      nodeViews: {
        inlineExtension: nodeViewFactory(providerFactory, {
          inlineExtension: MacroNode,
        }),
      },
    },
  });

export default createPlugin;
