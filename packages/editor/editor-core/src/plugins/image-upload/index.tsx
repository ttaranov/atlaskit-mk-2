import { EditorPlugin } from '../../types';
import { createPlugin, ImageUploadHandler } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';

export { ImageUploadHandler };

const imageUpload: EditorPlugin = {
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
