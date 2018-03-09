import * as React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/lists';
import inputRulePlugin from '../../../plugins/lists/input-rule';
import keymapPlugin from '../../../plugins/lists/keymap';
import ToolbarLists from '../../../ui/ToolbarLists';
import { ToolbarSize } from '../../ui/Toolbar';

const listPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'bulletList', node: bulletList, rank: 300 },
      { name: 'orderedList', node: orderedList, rank: 400 },
      { name: 'listItem', node: listItem, rank: 500 },
    ];
  },

  pmPlugins() {
    return [
      { rank: 600, plugin: () => plugin },
      { rank: 620, plugin: ({ schema }) => inputRulePlugin(schema) },
      { rank: 640, plugin: ({ schema }) => keymapPlugin(schema) },
    ];
  },

  primaryToolbarComponent({
    editorView,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const pluginState = stateKey.getState(editorView.state);
    const isSmall = toolbarSize < ToolbarSize.L;
    const isSeparator = toolbarSize >= ToolbarSize.S;
    return (
      <ToolbarLists
        isSmall={isSmall}
        isSeparator={isSeparator}
        isReducedSpacing={isToolbarReducedSpacing}
        disabled={disabled}
        editorView={editorView}
        pluginState={pluginState}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        enableTaskToolbar={
          !!editorView.state.schema.nodes.taskItem && appearance === 'full-page'
        }
      />
    );
  },
};

export default listPlugin;
