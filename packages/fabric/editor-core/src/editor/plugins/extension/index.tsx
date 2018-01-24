import {
  inlineExtension,
  extension,
  bodiedExtension,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import createPlugin from './plugin';

const extensionPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2300, name: 'extension', node: extension },
      { rank: 2310, name: 'bodiedExtension', node: bodiedExtension },
      { rank: 2320, name: 'inlineExtension', node: inlineExtension },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 2330,
        plugin: ({ schema, props, dispatch, providerFactory }) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
};

export default extensionPlugin;
