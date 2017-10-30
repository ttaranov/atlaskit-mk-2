import { doc, paragraph, text } from '@atlaskit/editor-common';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { EditorPlugin } from '../../types';
import { plugin as reactNodeView } from '../../../plugins/react-nodeview';

const basePlugin: EditorPlugin = {
  pmPlugins() {
    return [
      { rank: 9800, plugin: schema => reactNodeView },
      { rank: 9900, plugin: () => history() },
      // should be last :(
      { rank: 10000, plugin: () => keymap(baseKeymap) }
    ];
  },
  nodes() {
    return [
      { name: 'doc', rank: 0, node: doc },
      { name: 'paragraph', rank: 0, node: paragraph },
      { name: 'text', rank: 200, node: text }
    ];
  }
};

export default basePlugin;
