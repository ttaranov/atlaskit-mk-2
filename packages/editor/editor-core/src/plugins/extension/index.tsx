import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import createPlugin from './plugin';
import { getToolbarConfig } from './toolbar';

const extensionPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'extension', node: extension },
      { name: 'bodiedExtension', node: bodiedExtension },
      { name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'extension',
        plugin: ({ props, dispatch, providerFactory, portalProviderAPI }) =>
          createPlugin(
            dispatch,
            providerFactory,
            props.extensionHandlers || {},
            portalProviderAPI,
            props.allowExtension,
          ),
      },
    ];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig,
  },
};

export default extensionPlugin;
