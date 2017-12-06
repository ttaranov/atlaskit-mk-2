import { Plugin } from 'prosemirror-state';
import { drawPlaceholderCursor } from './cursor';
import { PluginKey } from 'prosemirror-state';

const stateKey = new PluginKey('placeHolderPlugin');
export { stateKey };

export const plugin = new Plugin({
  props: {
    decorations: drawPlaceholderCursor,
  },
  key: stateKey,
});

export default () => {
  return plugin;
};
