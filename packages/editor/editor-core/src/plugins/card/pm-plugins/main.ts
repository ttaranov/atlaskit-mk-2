import { Plugin, PluginKey } from 'prosemirror-state';
import { CardProvider, CardPluginState } from '../types';
import reducer from './reducers';
import { EditorView } from 'prosemirror-view';
import { setProvider } from './actions';
import { ReactNodeView } from '../../../nodeviews';
import inlineCardNodeView from '../nodeviews/inlineCard';

export const pluginKey = new PluginKey('cardPlugin');

export const createPlugin = ({
  portalProviderAPI,
  dispatch,
  providerFactory,
}) =>
  new Plugin({
    state: {
      init(): CardPluginState {
        return {
          requests: [],
          provider: null,
        };
      },

      apply(tr, pluginState: CardPluginState) {
        // update all the positions
        const remappedState = {
          ...pluginState,
          requests: pluginState.requests.map(request => ({
            ...request,
            pos: tr.mapping.map(request.pos),
          })),
        };

        // apply any actions
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const nextPluginState = reducer(remappedState, meta);
          return nextPluginState;
        }

        return remappedState;
      },
    },

    view(view: EditorView) {
      // listen for card provider changes
      const handleProvider = (name, provider) => {
        if (name !== 'cardProvider') {
          return;
        }

        provider.then((cardProvider: CardProvider) => {
          const { state, dispatch } = view;
          setProvider(cardProvider)(state, dispatch);
        });
      };

      providerFactory.subscribe('cardProvider', handleProvider);

      return {
        destroy() {
          providerFactory.unsubscribe('cardProvider', handleProvider);
        },
      };
    },

    props: {
      nodeViews: {
        inlineCard: ReactNodeView.fromComponent(
          inlineCardNodeView,
          portalProviderAPI,
          {
            providerFactory,
          },
        ),
      },
    },

    key: pluginKey,
  });
