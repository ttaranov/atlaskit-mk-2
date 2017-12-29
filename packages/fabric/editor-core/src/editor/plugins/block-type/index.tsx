import * as React from 'react';
import { heading, blockquote, hardBreak } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, stateKey } from '../../../plugins/block-type';
import inputRulePlugin from '../../../plugins/block-type/input-rule';
import ToolbarBlockType from '../../../ui/ToolbarBlockType';

const blockType: EditorPlugin = {
  nodes() {
    return [
      { name: 'heading', node: heading, rank: 600 },
      { name: 'blockquote', node: blockquote, rank: 700 },
      { name: 'hardBreak', node: hardBreak, rank: 1500 },
    ];
  },

  pmPlugins() {
    return [
      { rank: 500, plugin: ({ props }) => createPlugin(props.appearance) },
      { rank: 510, plugin: ({ schema }) => inputRulePlugin(schema) },
    ];
  },

  primaryToolbarComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    disabled,
  ) {
    const pluginState = stateKey.getState(editorView.state);
    return (
      <ToolbarBlockType
        isDisabled={disabled}
        editorView={editorView}
        pluginState={pluginState}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      />
    );
  },
};

export default blockType;
