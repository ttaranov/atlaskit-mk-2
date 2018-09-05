import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { status } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

const statusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'status', node: status }];
  },

  pmPlugins() {
    return [{ name: 'status', plugin: createPlugin }];
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Status Yay',
        priority: 1000,
        icon: () => <InfoIcon label="Status" />,
        action(insert, state) {
          return insert(
            state.schema.nodes.status.createChecked(
              { panelType: 'warning' },
              state.schema.nodes.paragraph.createChecked(),
            ),
          );
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
};

export default statusPlugin;
