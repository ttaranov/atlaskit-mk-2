import { EditorPlugin } from '../../types';
import { createPlugin, CollabEditProvider, pluginKey } from './plugin';
import { CollabEditOptions } from './types';

export { CollabEditOptions, CollabEditProvider, pluginKey };

const collabEditPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'collab',
        plugin: ({ dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
};

export default collabEditPlugin;
