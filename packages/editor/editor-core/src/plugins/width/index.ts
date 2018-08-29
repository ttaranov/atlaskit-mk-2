import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('widthPlugin');

export function createPlugin(
  dispatch: Dispatch<{ width?: number }>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => undefined,
      apply(tr, width) {
        const newWidth = tr.getMeta(pluginKey);
        if (newWidth && width !== newWidth) {
          dispatch(pluginKey, newWidth);
          return newWidth;
        }
        return width;
      },
    },
  });
}

const widthPlugin: EditorPlugin = {
  pmPlugins: () => [
    {
      name: 'width',
      plugin: ({ dispatch }) => createPlugin(dispatch),
    },
  ],
};

export default widthPlugin;
