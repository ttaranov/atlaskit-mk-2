import * as React from 'react';
import { textColor } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import {
  pluginKey,
  createPlugin,
  TextColorPluginConfig,
} from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';
import { changeColor } from './commands/change-color';

const pluginConfig = (
  textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

const textColorPlugin: EditorPlugin = {
  name: 'textColor',

  marks() {
    return [{ name: 'textColor', mark: textColor }];
  },

  pmPlugins() {
    return [
      {
        name: 'textColor',
        plugin: ({ props, dispatch }) =>
          createPlugin(dispatch, pluginConfig(props.allowTextColor)),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
  }) {
    return (
      <WithPluginState
        plugins={{
          textColor: pluginKey,
        }}
        render={({ textColor }) => (
          <ToolbarTextColor
            pluginState={textColor}
            isReducedSpacing={isToolbarReducedSpacing}
            changeColor={(color: string) =>
              changeColor(color)(editorView.state, editorView.dispatch)
            }
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
          />
        )}
      />
    );
  },
};

export default textColorPlugin;
