import * as React from 'react';
import { codeBlock } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/code-block';
import keymap from '../../../plugins/code-block/keymaps';
import LanguagePicker from '../../../ui/LanguagePicker';

const codeBlockPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'codeBlock', node: codeBlock, rank: 800 }];
  },

  pmPlugins() {
    return [
      { rank: 700, plugin: () => plugin },
      { rank: 720, plugin: (schema) => keymap(schema) },
    ];
  },

  contentComponent(editorView, dispatch, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement) {
    if (appearance === 'message') {
      return null;
    }

    const pluginState = stateKey.getState(editorView.state);
    return <LanguagePicker editorView={editorView} pluginState={pluginState} popupsMountPoint={popupsMountPoint} popupsBoundariesElement={popupsBoundariesElement} />;
  }
};

export default codeBlockPlugin;
