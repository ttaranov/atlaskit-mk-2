import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { DecorationSet } from 'prosemirror-view';
import {
  tableStartPos,
  getTableNode,
  createNumberColumnDecorationSet,
} from '../utils';
export const pluginKey = new PluginKey('tableNumberColumnPlugin');

export type State = {
  decorationSet: DecorationSet;
};

const plugin = new Plugin({
  state: {
    init: () => ({
      decorationSet: DecorationSet.empty,
    }),
    apply: (tr, state: State) => state,
  },
  key: pluginKey,
  props: {
    // disable number column cells from editing
    decorations: (state: EditorState) => createNumberColumnDecorationSet(state),
  },
  // adjust number column on each table modification
  appendTransaction: (
    transactions: Transaction[],
    oldState: EditorState,
    newState: EditorState,
  ) => {
    const tableNode = getTableNode(newState);
    if (
      tableNode &&
      tableNode.attrs.isNumberColumnEnabled &&
      transactions.some(transaction => transaction.docChanged) &&
      // ignore the transaction that enables number column (otherwise it goes into infinite loop)
      !transactions.some(transaction => transaction.getMeta(pluginKey))
    ) {
      const map = TableMap.get(tableNode);
      const start = tableStartPos(newState);
      const { tr } = newState;
      const { tableHeader, paragraph } = newState.schema.nodes;
      const increment =
        tableNode.child(0).child(0).type === tableHeader ? 0 : 1;
      let updated = false;

      for (let i = 0; i < tableNode.childCount; i++) {
        const cell = tableNode.child(i).child(0);
        const textContent = `${i + increment}`;
        if (cell.type === tableHeader) {
          continue;
        }
        const from = tr.mapping.map(start + map.map[i * map.width]);
        tr.replaceWith(
          from + 1,
          from + cell.nodeSize,
          paragraph.create({}, newState.schema.text(textContent)),
        );
        updated = true;
      }
      if (updated) {
        return tr;
      }
    }
  },
});

export default plugin;
