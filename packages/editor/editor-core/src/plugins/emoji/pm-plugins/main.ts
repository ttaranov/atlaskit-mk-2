import { Plugin, PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EmojiProvider } from '@atlaskit/emoji';

import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import emojiNodeView from '../nodeviews/emoji';
import { pluginStateFactory } from '../utils';
import { setProvider, setEmojis } from './actions';
import reducer from './reducer';

export const pluginKey = new PluginKey('emojiPlugin');
const { state, createCommand, getPluginState } = pluginStateFactory(
  pluginKey,
  { emojis: [] },
  reducer,
);

export { createCommand, getPluginState };

export function createPlugin(
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
) {
  return new Plugin({
    key: pluginKey,
    state,
    props: {
      nodeViews: {
        emoji: ReactNodeView.fromComponent(emojiNodeView, portalProviderAPI, {
          providerFactory,
        }),
      },
    },
    view: view => {
      const providerHandler = async (
        name: string,
        providerPromise?: Promise<EmojiProvider>,
      ) => {
        if (name !== 'emojiProvider') {
          return;
        }
        const { state, dispatch } = view;

        if (!providerPromise) {
          return setProvider()(state, dispatch);
        }

        try {
          const provider: EmojiProvider = await providerPromise;
          setProvider(provider, {
            result(result) {
              setEmojis(result.emojis)(view.state, view.dispatch);
            },
          })(state, dispatch);
        } catch {
          setProvider()(state, dispatch);
        }
      };
      providerFactory.subscribe('emojiProvider', providerHandler);

      return {
        destroy() {
          setProvider()(view.state, view.dispatch);
          if (providerFactory) {
            providerFactory.unsubscribe('emojiProvider', providerHandler);
          }
        },
      };
    },
  });
}
