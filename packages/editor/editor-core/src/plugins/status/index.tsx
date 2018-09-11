import * as React from 'react';
import { status } from '@atlaskit/editor-common';
import { findDomRefAtPos } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import createStatusPlugin, { StatusState, pluginKey } from './plugin';
import WithPluginState from '../../ui/WithPluginState';
import StatusPicker from './ui/statusPicker';
import { setColorPickerAt, insertStatus } from './actions';
import LabelIcon from '@atlaskit/icon/glyph/label';

export type StatusType = {
  color: string;
  text: string;
  localId?: string;
};

const statusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'status', node: status }];
  },

  pmPlugins() {
    return [
      {
        name: 'status',
        plugin: createStatusPlugin,
      },
    ];
  },

  contentComponent({ editorView }) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        plugins={{
          statusState: pluginKey,
        }}
        render={({ statusState = {} as StatusState }) => {
          if (statusState.showStatusPickerAt === null) {
            return null;
          }

          const element = findDomRefAtPos(
            statusState.showStatusPickerAt,
            editorView.domAtPos.bind(editorView),
          ) as HTMLElement;

          return (
            <StatusPicker
              element={element}
              onSelect={status =>
                insertStatus(status)(editorView.state, dispatch)
              }
              onTextChanged={status =>
                insertStatus(status)(editorView.state, dispatch)
              }
              closeStatusPicker={() =>
                setColorPickerAt(null)(editorView.state, dispatch)
              }
            />
          );
        }}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Status',
        priority: 700,
        keywords: ['lozenge'],
        icon: () => <LabelIcon label="Status" />,
        action(insert, state) {
          const statusNode = state.schema.nodes.status.createChecked({
            text: 'Default',
            color: 'neutral',
          });

          const tr = insert(statusNode);
          const showStatusPickerAt = tr.selection.from - 2;
          tr.setSelection(NodeSelection.create(tr.doc, showStatusPickerAt));
          return tr.setMeta(pluginKey, { showStatusPickerAt });
        },
      },
    ],
  },
};

export default statusPlugin;
