import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { doc, paragraph, text } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import { plugin as reactNodeView } from './pm-plugins/react-nodeview';

const basePlugin: EditorPlugin = {
  pmPlugins() {
    return [
      { rank: -1, plugin: ({ dispatch }) => focusHandlerPlugin(dispatch) },
      { rank: 9800, plugin: () => reactNodeView },
      { rank: 9900, plugin: () => history() },
      // should be last :(
      {
        rank: 10000,
        plugin: () =>
          keymap({
            ...baseKeymap,
            'Mod-[': () => true,
            'Mod-]': () => true,
          }),
      },
    ];
  },
  nodes() {
    return [
      { name: 'doc', rank: 0, node: doc },
      { name: 'paragraph', rank: 0, node: paragraph },
      { name: 'text', rank: 200, node: text },
    ];
  },
};

export default basePlugin;
