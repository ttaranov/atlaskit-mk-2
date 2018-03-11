import { EditorPlugin } from '../../types';
import nodeViewsPlugin from './pm-plugins/node-views';
import keymaps from './pm-plugins/keymaps';

const codeMirrorPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      { rank: 9100, plugin: () => nodeViewsPlugin() },
      { rank: 9200, plugin: () => keymaps() },
    ];
  },
};

export default codeMirrorPlugin;
