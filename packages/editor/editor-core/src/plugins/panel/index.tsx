import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { panel } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey, PanelState } from './pm-plugins/main';
import PanelEdit from './ui/PanelEdit';
import WithPluginState from '../../ui/WithPluginState';
import { removePanel, changePanelType } from './actions';

const panelPlugin: EditorPlugin = {
  nodes() {
    return [{ rank: 1100, name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [{ rank: 1110, plugin: createPlugin }];
  },

  contentComponent({ editorView }) {
    return (
      <WithPluginState
        plugins={{
          panelState: pluginKey,
        }}
        render={({ panelState = {} as PanelState }) => (
          <PanelEdit
            editorView={editorView}
            pluginState={panelState}
            onRemove={() => removePanel(editorView)}
            onPanelChange={panelType => {
              changePanelType(editorView, panelType);
            }}
          />
        )}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Panel',
        icon: () => <InfoIcon label="Panel" />,
        action(insert, state) {
          return insert(
            state.schema.nodes.panel.createChecked(
              {},
              state.schema.nodes.paragraph.createChecked(),
            ),
          );
        },
      },
    ],
  },
};

export default panelPlugin;
