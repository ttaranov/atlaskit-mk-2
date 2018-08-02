import { EditorPlugin } from '../../types';
import { createPlugin, ImageUploadHandler } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';

export { ImageUploadHandler };

const imageUpload: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'imageUpload',
        plugin: ({ schema, providerFactory }) =>
          createPlugin(schema, { providerFactory }),
      },
      {
        name: 'imageUploadInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
    ];
  },
};

export default imageUpload;
