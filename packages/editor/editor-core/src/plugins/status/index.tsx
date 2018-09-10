import * as React from 'react';
import { status } from '@atlaskit/editor-common';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorPlugin } from '../../types';
import createStatusPlugin, { StatusState, pluginKey } from './plugin';
import WithPluginState from '../../ui/WithPluginState';
import StatusPicker from './ui/statusPicker';
import { setColorPickerAt, insertStatus } from './actions';

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
              closeStatusPicker={() =>
                setColorPickerAt(null)(editorView.state, dispatch)
              }
            />
          );
        }}
      />
    );
  },
};

export default statusPlugin;
