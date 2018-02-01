import { Plugin } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { drawFakeTextCursor } from './cursor';
import { EditorPlugin } from '../../types';

export const stateKey = new PluginKey('fakeTextCursorPlugin');

export const createPlugin = () =>
  new Plugin({
    key: stateKey,
    props: {
      decorations: drawFakeTextCursor,
    },
  });

const fakeTextCursorPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 2100, plugin: () => createPlugin() }];
  },
};

export default fakeTextCursorPlugin;
