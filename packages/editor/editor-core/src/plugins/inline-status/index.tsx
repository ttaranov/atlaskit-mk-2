import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import { inlineStatus } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey, StatusState } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import { Selection } from 'prosemirror-state';
import StatusPicker from './ui/statusPicker';
import WithPluginState from '../../ui/WithPluginState';
import { findDomRefAtPos } from 'prosemirror-utils';
import { setDatePickerAt, closeDatePicker, changeColor } from './actions';

const inlineStatusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'inlineStatus', node: inlineStatus }];
  },

  pmPlugins() {
    return [{ name: 'inlineStatus', plugin: createPlugin }];
  },

  contentComponent({ editorView }) {
    const { dispatch } = editorView;
    return (
      <WithPluginState
        plugins={{
          statusState: pluginKey,
        }}
        render={({ statusState = {} as StatusState }) => {
          if (statusState.showDatePickerAt === null) {
            return null;
          }

          const element = findDomRefAtPos(
            statusState.showDatePickerAt,
            editorView.domAtPos.bind(editorView),
          ) as HTMLElement;

          return (
            <StatusPicker
              element={element}
              onSelect={color => {
                console.log(
                  '#StatusPicker.onSelect color: ',
                  color,
                  ' statusState: ',
                  statusState,
                );
                changeColor(color)(editorView.state, dispatch);
              }}
              closeStatusPicker={() =>
                setDatePickerAt(null)(editorView.state, dispatch)
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
  },
};

export default inlineStatusPlugin;
