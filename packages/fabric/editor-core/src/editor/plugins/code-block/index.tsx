import * as React from 'react';
import { codeBlock, codeFormat, codeWrapper } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/code-block';
import keymap from '../../../plugins/code-block/keymaps';
import LanguagePicker from '../../../ui/LanguagePicker';

const codeBlockPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'codeFormat', mark: codeFormat, rank: 212 }];
  },

  nodes() {
    return [
      { name: 'codeBlock', node: codeBlock, rank: 800 },
      { name: 'codeWrapper', node: codeWrapper, rank: 801 },
    ];
  },

  pmPlugins() {
    return [
      { rank: 700, plugin: () => plugin },
      { rank: 720, plugin: ({ schema }) => keymap(schema) },
    ];
  },

  contentComponent({
    editorView,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
  }) {
    if (appearance === 'message') {
      return null;
    }

    const pluginState = stateKey.getState(editorView.state);
    return (
      <LanguagePicker
        editorView={editorView}
        pluginState={pluginState}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      />
    );
  },
};

export default codeBlockPlugin;
