import { Plugin, NodeSelection, TextSelection } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { placeholder } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';

export const pluginKey = new PluginKey('placeholderTextPlugin');

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => ({}),
      apply: (tr, state) => state,
    },
    props: {
      handleClick(view, pos, event) {
        const maybeNode = view.state.doc.nodeAt(pos);
        const { schema } = view.state;
        if (maybeNode && maybeNode.type === schema.nodes.placeholder) {
          const maybeSelection = TextSelection.create(view.state.tr.doc, pos);
          if (maybeSelection) {
            document.getSelection().empty();
            view.dispatch(view.state.tr.setSelection(maybeSelection));
          }
          return true;
        }
        return false;
      },
    },
    appendTransaction(transactions, oldState, newState) {
      if (transactions.some(txn => txn.docChanged)) {
        const didPlaceholderExistBeforeTxn =
          oldState.selection.$head.nodeAfter ===
          newState.selection.$head.nodeAfter;
        const adjacentNode = newState.selection.$head.nodeAfter;
        const adjacentNodePos = newState.selection.$head.pos;
        const placeholderNodeType = newState.schema.nodes.placeholder;
        if (
          adjacentNode &&
          adjacentNode.type === placeholderNodeType &&
          didPlaceholderExistBeforeTxn
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
