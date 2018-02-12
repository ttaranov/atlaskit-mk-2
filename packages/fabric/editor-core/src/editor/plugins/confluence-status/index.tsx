import * as React from 'react';
import { confluenceStatus } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, stateKey } from './plugin';
import StatusEdit from './ui/StatusEdit';

const conflunceStatusPlugin: EditorPlugin = {
  marks() {
    return [{ name: 'confluenceStatus', mark: confluenceStatus, rank: 2401 }];
  },

  pmPlugins() {
    return [
      {
        rank: 2411,
        plugin: ({ schema, props, dispatch, providerFactory }) =>
          createPlugin(),
      },
    ];
  },

  contentComponent({ editorView }) {
    const pluginState = stateKey.getState(editorView.state);
    return <StatusEdit editorView={editorView} pluginState={pluginState} />;
  },
};

export default conflunceStatusPlugin;
