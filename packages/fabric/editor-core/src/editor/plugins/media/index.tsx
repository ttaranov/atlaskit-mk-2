import * as React from 'react';
import { media, mediaGroup } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { stateKey as pluginKey, createPlugin } from '../../../plugins/media';
import keymapPlugin from '../../../plugins/media/keymap';
import ToolbarMedia from '../../../ui/ToolbarMedia';

const mediaPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'mediaGroup', node: mediaGroup, rank: 1700 },
      { name: 'media', node: media, rank: 1800 }
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 1200,
        plugin: (schema, props, dispatch, providerFactory, errorReporter) =>
          createPlugin(
            schema,
            {
              providerFactory,
              errorReporter,
              uploadErrorHandler: props.uploadErrorHandler,
              waitForMediaUpload: props.waitForMediaUpload
            },
            dispatch
          )
      },
      { rank: 1220, plugin: schema => keymapPlugin(schema) }
    ];
  },

  secondaryToolbarComponent(editorView, providerFactory) {
    return <ToolbarMedia editorView={editorView} pluginKey={pluginKey} />;
  }
};

export default mediaPlugin;
