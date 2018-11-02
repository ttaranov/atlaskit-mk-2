import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { doc, paragraph, text } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import { plugin as reactNodeView } from './pm-plugins/react-nodeview';

const basePlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'inlineCursorTargetPlugin',
        plugin: () => inlineCursorTargetPlugin(),
      },
      {
        name: 'focusHandlerPlugin',
        plugin: ({ dispatch }) => focusHandlerPlugin(dispatch),
      },
      { name: 'reactNodeView', plugin: () => reactNodeView },
      { name: 'history', plugin: () => history() },
      // should be last :(
      {
        name: 'codeBlockIndent',
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
      { name: 'doc', node: doc },
      { name: 'paragraph', node: paragraph },
      { name: 'text', node: text },
    ];
  },
};

export default basePlugin;
