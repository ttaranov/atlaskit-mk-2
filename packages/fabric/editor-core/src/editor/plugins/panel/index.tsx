import * as React from 'react';
import { panel } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey } from '../../../plugins/panel';
import inputRulePlugin from '../../../plugins/panel/input-rules';
import PanelEdit from '../../../ui/PanelEdit';

const panelPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1100, name: 'panel', node: panel }
    ];
  },

  pmPlugins() {
    return [
      { rank: 1110, plugin: () => plugin },
      { rank: 1120, plugin: schema => inputRulePlugin(schema) }
    ];
  },

  contentComponent(editorView) {
    const pluginState = stateKey.getState(editorView.state);

    return (
      <PanelEdit editorView={editorView} pluginState={pluginState}  />
    );
  }
};

export default panelPlugin;
