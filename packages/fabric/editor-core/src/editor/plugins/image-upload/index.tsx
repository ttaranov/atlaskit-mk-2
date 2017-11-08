import * as React from 'react';
import { image } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, stateKey, ImageUploadHandler } from '../../../plugins/image-upload';
import inputRulePlugin from '../../../plugins/image-upload/input-rule';
import ToolbarImage from '../../../ui/ToolbarImage';

export { ImageUploadHandler };

const imageUpload: EditorPlugin = {
  nodes() {
    return [{ name: 'image', rank: 1699, node: image }];
  },

  pmPlugins() {
    return [
      {
        rank: 1298,
        plugin: (schema, props, dispatch, providerFactory) => createPlugin(schema, { providerFactory })
      },
      { rank: 1299, plugin: schema => inputRulePlugin(schema) },
    ];
  },

  secondaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance) {
    const imageUploadState = stateKey.getState(editorView.state);
    return <ToolbarImage editorView={editorView} pluginState={imageUploadState} />;
  }
};

export default imageUpload;
