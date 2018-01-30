import { Plugin } from 'prosemirror-state';
import { drawFakeTextCursor } from './cursor';
import { PluginKey } from 'prosemirror-state';

const stateKey = new PluginKey('fakeTextCursorPlugin');
export { stateKey };

export const plugin = new Plugin({
  props: {
    decorations: drawFakeTextCursor,
  },
  key: stateKey,
});

export default () => {
  return plugin;
};
