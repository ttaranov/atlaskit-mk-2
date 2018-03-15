import { EditorPlugin } from '../../types';
import { createPlugin, createKeymapPlugin } from './pm-plugins/main';

const paste: EditorPlugin = {
  pmPlugins() {
    return [
      {
        rank: 100,
        plugin: ({ schema, props }) => createPlugin(schema, props.appearance),
      },
      { rank: 200, plugin: ({ schema }) => createKeymapPlugin(schema) },
    ];
  },
};

export default paste;
