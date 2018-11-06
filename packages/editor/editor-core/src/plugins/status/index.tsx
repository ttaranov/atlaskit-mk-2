import * as React from 'react';
import { status } from '@atlaskit/editor-common';
import LabelIcon from '@atlaskit/icon/glyph/label';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorPlugin } from '../../types';
import createStatusPlugin, { StatusState, pluginKey } from './plugin';
import WithPluginState from '../../ui/WithPluginState';
import StatusPicker from './ui/statusPicker';
import { commitStatusPicker, updateStatus, createStatus } from './actions';

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
              autoFocus={statusState.autoFocus}
              element={element}
              onSelect={status => {
                updateStatus(status)(editorView);
              }}
              onTextChanged={status => {
                updateStatus(status)(editorView);
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
        action: createStatus(-2),
      },
    ],
  },
};

export default statusPlugin;
