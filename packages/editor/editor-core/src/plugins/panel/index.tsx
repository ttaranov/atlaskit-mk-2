import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { panel } from '@atlaskit/editor-common';

import { EditorPlugin } from '../../types';
import { messages } from '../block-type/types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

import keymap from './pm-plugins/keymaps';

const panelPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [
      { name: 'panel', plugin: createPlugin },
      {
        name: 'panelKeyMap',
        plugin: () => keymap(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.panel),
        priority: 1000,
        icon: () => <InfoIcon label={formatMessage(messages.panel)} />,
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
