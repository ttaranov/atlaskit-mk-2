import { layoutSection, layoutColumn } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import {
  default as layoutPlugin,
  pluginKey,
  LayoutState,
} from './pm-plugins/main';
import { buildToolbar } from './toolbar';

export { pluginKey };

export default {
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
        plugin: () => layoutPlugin,
      },
    ];
  },
  pluginsOptions: {
    floatingToolbar(state): FloatingToolbarConfig | undefined {
      const { pos } = pluginKey.getState(state) as LayoutState;
      if (pos !== null) {
        return buildToolbar(state, pos);
      }
      return undefined;
    },
  },
} as EditorPlugin;
