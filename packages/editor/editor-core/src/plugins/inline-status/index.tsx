import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { status } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import { Selection } from 'prosemirror-state';

const inlineStatusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'status', node: status }];
  },

  pmPlugins() {
    return [{ name: 'status', plugin: createPlugin }];
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Inline Status',
        priority: 1000,
        icon: () => <InfoIcon label="Status" />,
        action(insert, state) {
          const tr = insert(
            state.schema.nodes.status.createChecked(
              {},
              state.schema.text('Status'),
            ),
          );
          tr.setSelection(
            Selection.near(tr.doc.resolve(state.tr.selection.from)),
          );
          return tr;
        },
      },
    ],
    //floatingToolbar: getToolbarConfig,
  },
};

export default inlineStatusPlugin;
