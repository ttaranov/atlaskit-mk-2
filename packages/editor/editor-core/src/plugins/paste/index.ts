import { EditorPlugin } from '../../types';
import { createPlugin, createKeymapPlugin } from './pm-plugins/main';

const paste: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({ schema, props }) => createPlugin(schema, props.appearance),
      },
      {
        name: 'pasteKeymap',
        plugin: ({ schema }) => createKeymapPlugin(schema),
      },
    ];
  },
};

export default paste;
