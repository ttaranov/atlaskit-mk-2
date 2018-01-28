import { Plugin, NodeSelection, TextSelection } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { placeholderText } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';

export const pluginKey = new PluginKey('placeholderTextPlugin');

export function createPlugin(): Plugin | undefined {
  return new Plugin({
    key: pluginKey,
    props: {
      handleClick(view, pos, event) {
        const maybeNode = view.state.doc.nodeAt(pos - 1);
        if (maybeNode && maybeNode.type.name === 'placeholderText') {
          const maybeSelection = TextSelection.create(
            view.state.tr.doc,
            pos - 1,
          );
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
        if (
          adjacentNode &&
          adjacentNode.type.name === 'placeholderText' &&
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
    return [{ name: 'placeholderText', node: placeholderText, rank: 1600 }];
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
