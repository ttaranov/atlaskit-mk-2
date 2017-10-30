import * as React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/lists';
import inputRulePlugin from '../../../plugins/lists/input-rule';
import keymapPlugin from '../../../plugins/lists/keymap';
import ToolbarLists from '../../../ui/ToolbarLists';

const listPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'bulletList', node: bulletList, rank: 300 },
      { name: 'orderedList', node: orderedList, rank: 400 },
      { name: 'listItem', node: listItem, rank: 500 }
    ];
  },

  pmPlugins() {
    return [
      { rank: 600, plugin: () => plugin },
      { rank: 620, plugin: (schema) => inputRulePlugin(schema) },
      { rank: 640, plugin: (schema) => keymapPlugin(schema) }
    ];
  },

  primaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled) {
    const pluginState = stateKey.getState(editorView.state);
    return <ToolbarLists disabled={disabled} editorView={editorView} pluginState={pluginState} />;
  }
};

export default listPlugin;
