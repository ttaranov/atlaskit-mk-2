import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('widthPlugin');

export type WidthPluginState = {
  width: number;
  lineLength?: number;
};

export function createPlugin(
  dispatch: Dispatch<WidthPluginState>,
): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({
        width: document.body.offsetWidth,
      }),
      apply(tr, oldPluginState) {
        const newPluginState = tr.getMeta(pluginKey);

        if (
          newPluginState &&
          (oldPluginState.width !== newPluginState.newWidth ||
            oldPluginState.lineLength !== newPluginState.lineLength)
        ) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }
        return oldPluginState;
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
