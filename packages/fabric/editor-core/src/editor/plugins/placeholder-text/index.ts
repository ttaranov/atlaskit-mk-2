import { Plugin, NodeSelection } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { placeholder } from '@atlaskit/editor-common';
import PlaceholderTextNodeView from '../../../nodeviews/ui/placeholder-text';
import { EditorPlugin } from '../../types/editor-plugin';

export const pluginKey = new PluginKey('placeholderTextPlugin');

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({}),
      apply: (tr, state) => state,
    },
    props: {
      nodeViews: {
        placeholder: (node, view, getPos) =>
          new PlaceholderTextNodeView(node, view, getPos),
      },
    },
    appendTransaction(transactions, oldState, newState) {
      if (transactions.some(txn => txn.docChanged)) {
        const didPlaceholderExistBeforeTxn =
          oldState.selection.$head.nodeAfter ===
          newState.selection.$head.nodeAfter;
        const wasContentAdded =
          oldState.selection.$head.pos <= newState.selection.$head.pos;
        const adjacentNode = newState.selection.$head.nodeAfter;
        const adjacentNodePos = newState.selection.$head.pos;
        const placeholderNodeType = newState.schema.nodes.placeholder;
        if (
          adjacentNode &&
          adjacentNode.type === placeholderNodeType &&
          didPlaceholderExistBeforeTxn &&
          wasContentAdded
        ) {
          const { $from, $to } = NodeSelection.create(
            newState.doc,
            adjacentNodePos,
          );
          return newState.tr.deleteRange($from.pos, $to.pos);
        }
      }
    },
  });
}

const placeholderTextPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'placeholder', node: placeholder, rank: 1600 }];
  },

  pmPlugins() {
    return [
      {
        rank: 400,
        plugin: ({ schema, props }) => createPlugin(),
      },
    ];
  },
};

export default placeholderTextPlugin;
