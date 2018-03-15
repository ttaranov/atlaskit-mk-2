import * as React from 'react';
import { textColor } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';

const textColorPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'textColor', mark: textColor, rank: 1700 }];
  },

  pmPlugins() {
    return [{ rank: 600, plugin: () => plugin }];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const pluginState = stateKey.getState(editorView.state);
    return (
      <ToolbarTextColor
        disabled={disabled}
        isReducedSpacing={isToolbarReducedSpacing}
        editorView={editorView}
        pluginState={pluginState}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
      />
    );
  },
};

export default textColorPlugin;
