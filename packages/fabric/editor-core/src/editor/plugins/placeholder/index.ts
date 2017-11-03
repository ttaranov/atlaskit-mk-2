import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { EditorPlugin } from '../../types';
import { isEmpty, isEmptyParagraph } from '../../utils';

export const pluginKey = new PluginKey('placeholderPlugin');

export function createPlaceholderDecoration(doc: Node, placeholderText: string): DecorationSet {
  const placeholderNode = document.createElement('span');
  placeholderNode.className = 'placeholder-decoration';
  placeholderNode.setAttribute('data-text', placeholderText);
  return DecorationSet.create(doc, [Decoration.widget(1, placeholderNode)]);
}

export function createPlugin(placeholderText?: string): Plugin | undefined {
  if (!placeholderText) {
    return;
  }

  return new Plugin({
    key: pluginKey,
    props: {
      decorations(editorState): DecorationSet | undefined {
        if (isEmpty(editorState.doc) && isEmptyParagraph(editorState.doc.firstChild)) {
          return createPlaceholderDecoration(editorState.doc, placeholderText);
        }
      }
    }
  });
}

const placeholderPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      { rank: 10000, plugin: (schema, props) => createPlugin(props.placeholder)}
    ];
  }
};

export default placeholderPlugin;
