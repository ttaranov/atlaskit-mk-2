import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Objects24CodeIcon from '@atlaskit/icon/glyph/objects/24/code';
import { codeBlock } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from './pm-plugins/main';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import LanguagePicker from './ui/LanguagePicker';

const codeBlockPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'codeBlock', node: codeBlock, rank: 800 }];
  },

  pmPlugins() {
    return [
      { rank: 700, plugin: () => plugin },
      { rank: 710, plugin: () => ideUX },
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

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Code block',
        keywords: ['javascript', 'typescript'],
        icon: () => (
          <Objects24CodeIcon label="Code block" primaryColor={colors.N300} />
        ),
        action(insert, state) {
          const schema = state.schema;
          return insert(schema.nodes.codeBlock.createChecked());
        },
      },
    ],
  },
};

export default codeBlockPlugin;
