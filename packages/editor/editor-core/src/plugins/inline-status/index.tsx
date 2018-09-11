import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { inlineStatus } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import { Selection } from 'prosemirror-state';

const inlineStatusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'inlineStatus', node: inlineStatus }];
  },

  pmPlugins() {
    return [{ name: 'inlineStatus', plugin: createPlugin }];
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Inline Status',
        priority: 1000,
        icon: () => <InfoIcon label="Status" />,
        action(insert, state) {
          const tr = insert(
            state.schema.nodes.inlineStatus.createChecked(
              {},
              state.schema.text('DEFAULT'),
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
