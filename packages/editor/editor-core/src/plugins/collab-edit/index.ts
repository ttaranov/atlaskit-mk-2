import { collab } from 'prosemirror-collab';
import { EditorPlugin } from '../../types';
import { createPlugin, CollabEditProvider, pluginKey } from './plugin';
import { CollabEditOptions } from './types';

export { CollabEditOptions, CollabEditProvider, pluginKey };

const collabEditPlugin = (options?: CollabEditOptions): EditorPlugin => ({
  pmPlugins() {
    return [
      {
        rank: 990,
        plugin: () => collab({ clientID: options ? options.clientID : null }),
      },
      {
        rank: 1000,
        plugin: ({ dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
});

export default collabEditPlugin;
