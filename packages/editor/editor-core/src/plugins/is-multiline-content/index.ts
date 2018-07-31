import { Plugin, PluginKey } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('isMultilineContentPlugin');

export const isMultiline = (doc: Node) => {
  if (doc.childCount > 1) {
    return true;
  }

  if (doc.firstChild!.type.name !== 'paragraph') {
    return true;
  }

  const paragraph = doc.firstChild!;
  if (paragraph.firstChild && paragraph.firstChild.type.name === 'hardBreak') {
    return true;
  }

  if (paragraph.childCount === 1) {
    return false;
  }

  for (let child = 0; child < paragraph.childCount; child++) {
    if (paragraph.child(child).type.name === 'hardBreak') {
      return true;
    }
  }

  return false;
};

export function createPlugin(dispatch: Dispatch): Plugin | undefined {
  return new Plugin({
    state: {
      init(config, editorState) {
        return false;
      },

      apply(tr, isMultilineContent, oldState, newState) {
        const state = isMultiline(newState.doc);
        if (state !== isMultilineContent) {
          dispatch(pluginKey, state);
        }
        return state;
      },
    },
  });
}

const isMultilineContentPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'multilineContent',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
    ];
  },
};

export default isMultilineContentPlugin;
