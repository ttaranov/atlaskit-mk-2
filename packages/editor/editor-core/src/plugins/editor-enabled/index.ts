import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('editorEnabledPlugin');

export type EditorEnabledPluginState = {
  editorEnabled: boolean;
};

export function createPlugin(
  dispatch: Dispatch<EditorEnabledPluginState>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({
        editorEnabled: false,
      }),
      apply(tr, oldPluginState) {
        const newPluginState = tr.getMeta(pluginKey);

        if (
          newPluginState &&
          oldPluginState.editorEnabled !== newPluginState.newEditorEnabled
        ) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }
        return oldPluginState;
      },
    },
  });
}

const editorEnabledPlugin: EditorPlugin = {
  pmPlugins: () => [
    {
      name: 'editorEnabled',
      plugin: ({ dispatch }) => createPlugin(dispatch),
    },
  ],
};

export default editorEnabledPlugin;
