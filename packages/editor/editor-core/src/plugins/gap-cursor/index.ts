import { EditorPlugin } from '../../types';
import plugin from './pm-plugins/main';

export { GapCursorSelection, Side } from './selection';

export default {
  pmPlugins() {
    return [
      {
        rank: 100,
        plugin: ({ schema, props }) => plugin,
      },
    ];
  },
} as EditorPlugin;
