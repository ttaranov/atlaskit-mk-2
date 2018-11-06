import * as React from 'react';
import { status, uuid } from '@atlaskit/editor-common';
import LabelIcon from '@atlaskit/icon/glyph/label';
import { findDomRefAtPos } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import createStatusPlugin, { StatusState, pluginKey } from './plugin';
import WithPluginState from '../../ui/WithPluginState';
import StatusPicker from './ui/statusPicker';
import { commitStatusPicker, DEFAULT_STATUS, insertStatus } from './actions';

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
              onSelect={status => {
                insertStatus(status)(editorView);
              }}
              onTextChanged={status => {
                insertStatus(status)(editorView);
              }}
              closeStatusPicker={() => {
                commitStatusPicker()(editorView);
              }}
              onEnter={() => {
                commitStatusPicker()(editorView);
              }}
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
            ...DEFAULT_STATUS,
            localId: uuid.generate(),
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
