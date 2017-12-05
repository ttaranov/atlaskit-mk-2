import { EditorPlugin } from '../../types';
import { createPlugin, CollabEditProvider, pluginKey } from './plugin';

export { CollabEditProvider, pluginKey };

const collabEditPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        rank: 1000,
        plugin: ({ dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
};

export default collabEditPlugin;
