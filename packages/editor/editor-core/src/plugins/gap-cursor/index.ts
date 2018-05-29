import { EditorPlugin } from '../../types';
import plugin from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { dropCursor } from './pm-plugins/dropCursor';

export { GapCursorSelection, Side } from './selection';
export { setGapCursorForTopLevelBlocks } from './actions';

export default {
  pmPlugins() {
    return [
      {
        rank: 850,
        plugin: ({ schema, props }) => keymapPlugin(),
      },
      {
        rank: 860,
        plugin: ({ schema, props }) => plugin,
      },
      {
        rank: 870,
        plugin: () => dropCursor({ width: 800, color: 'blue' }),
      },
    ];
  },
} as EditorPlugin;
