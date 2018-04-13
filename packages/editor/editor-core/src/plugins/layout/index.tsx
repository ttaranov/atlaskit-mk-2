import { layoutSection, layoutColumn } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { Plugin, PluginKey } from 'prosemirror-state';

export const pluginKey = new PluginKey('layout');

const layoutPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2400, name: 'layoutSection', node: layoutSection },
      { rank: 2400, name: 'layoutColumn', node: layoutColumn },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 2400,
        plugin: () =>
          new Plugin({
            key: pluginKey,
            state: {
              init: () => ({}),
              apply: (tr, state) => state,
            },
          }),
      },
    ];
  },
};

export default layoutPlugin;
