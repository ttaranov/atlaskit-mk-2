import { collab } from 'prosemirror-collab';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey } from './plugin';
import { CollabEditOptions } from './types';
export { CollabProvider, CollabEditProvider } from './provider';

export { CollabEditOptions, pluginKey };

const collabEditPlugin = (options?: CollabEditOptions): EditorPlugin => ({
  pmPlugins() {
    const { useNativePlugin = false, userId = null } = options || {};

    return [
      ...(useNativePlugin
        ? [
            {
              name: 'pmCollab',
              plugin: () => collab({ clientID: userId }),
            },
          ]
        : []),
      {
        name: 'collab',
        plugin: ({ dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory, options),
      },
    ];
  },
});

export default collabEditPlugin;
