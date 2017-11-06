import { confluenceUnsupportedBlock, confluenceUnsupportedInline } from '@atlaskit/editor-common';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import {
  nodeViewFactory,
  ReactUnsupportedBlockNode,
  ReactUnsupportedInlineNode
} from '../../../nodeviews';
import { traverseNode } from './utils';

export const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin = (schema, providerFactory) => {
  return new Plugin({
    state: {
      init(config, state: EditorState) {
        traverseNode(state.doc, schema);
      },
      apply(tr, pluginState, oldState, newState) {
        return pluginState;
      }
    },
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: nodeViewFactory(providerFactory, { confluenceUnsupportedBlock: ReactUnsupportedBlockNode }, true),
        confluenceUnsupportedInline: nodeViewFactory(providerFactory, { confluenceUnsupportedInline: ReactUnsupportedInlineNode })
      }
    }
  });
};

const unsupportedContentPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1300, name: 'confluenceUnsupportedBlock', node: confluenceUnsupportedBlock  },
      { rank: 1310, name: 'confluenceUnsupportedInline', node: confluenceUnsupportedInline },
    ];
  },

  pmPlugins() {
    return [
      { rank: 1320, plugin: (schema, props, dispatch, providerFactory) => createPlugin(schema, providerFactory) }
    ];
  }
};

export default unsupportedContentPlugin;
