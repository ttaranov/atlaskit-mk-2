import { textColor } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin } from '../../../plugins/text-color';

const textColorPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'textColor', mark: textColor, rank: 1700 }];
  },

  pmPlugins() {
    return [
      { rank: 600, plugin: () => plugin },
    ];
  },

  primaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled) {
    return null;
  }
};

export default textColorPlugin;
