import * as React from 'react';
import { heading, blockquote, hardBreak } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { ToolbarSize } from '../../ui/Toolbar';
import { createPlugin, stateKey } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';
import ToolbarBlockType from './ui/ToolbarBlockType';

const blockType: EditorPlugin = {
  nodes({ allowBlockType }) {
    const nodes = [
      { name: 'heading', node: heading, rank: 600 },
      { name: 'blockquote', node: blockquote, rank: 700 },
      { name: 'hardBreak', node: hardBreak, rank: 1500 },
    ];

    if (allowBlockType) {
      const exclude = allowBlockType.exclude ? allowBlockType.exclude : [];
      return nodes.filter(node => exclude.indexOf(node.name) === -1);
    }

    return nodes;
  },

  pmPlugins() {
    return [
      {
        rank: 500,
        plugin: ({ props }) => createPlugin(props.appearance),
      },
      { rank: 510, plugin: ({ schema }) => inputRulePlugin(schema) },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing right/down arrow events inside tables
      { rank: 925, plugin: ({ schema }) => keymapPlugin(schema) },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const pluginState = stateKey.getState(editorView.state);
    const isSmall = toolbarSize < ToolbarSize.XL;
    return (
      <ToolbarBlockType
        isSmall={isSmall}
        isDisabled={disabled}
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

export default blockType;
