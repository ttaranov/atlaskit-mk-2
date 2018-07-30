import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { panel } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

const panelPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [{ name: 'panel', plugin: createPlugin }];
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Panel',
        priority: 1000,
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
    floatingToolbar: getToolbarConfig,
  },
};

export default panelPlugin;
