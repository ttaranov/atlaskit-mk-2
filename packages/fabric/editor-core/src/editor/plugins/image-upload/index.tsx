import * as React from 'react';
import { image } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import {
  createPlugin,
  ImageUploadHandler,
} from '../../../plugins/image-upload';
import inputRulePlugin from '../../../plugins/image-upload/input-rule';

export { ImageUploadHandler };

const imageUpload: EditorPlugin = {
  nodes() {
    return [{ name: 'image', rank: 1699, node: image }];
  },

  pmPlugins() {
    return [
      {
        rank: 1298,
        plugin: ({ schema, providerFactory }) =>
          createPlugin(schema, { providerFactory }),
      },
      { rank: 1299, plugin: ({ schema }) => inputRulePlugin(schema) },
    ];
  },
};

export default imageUpload;
