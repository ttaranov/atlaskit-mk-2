import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { DecorationSet } from 'prosemirror-view';
import { findTable } from 'prosemirror-utils';
import { createNumberColumnDecorationSet } from '../utils';
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
    const table = findTable(newState.selection);
    if (
      table &&
      table.node.attrs.isNumberColumnEnabled &&
      transactions.some(transaction => transaction.docChanged) &&
      // ignore the transaction that enables number column (otherwise it goes into infinite loop)
      !transactions.some(transaction => transaction.getMeta(pluginKey))
    ) {
      const map = TableMap.get(table.node);
      const { pos: start } = findTable(newState.selection)!;
      const { tr } = newState;
      const { tableHeader, paragraph } = newState.schema.nodes;
      const increment =
        table.node.child(0).child(0).type === tableHeader ? 0 : 1;
      let updated = false;

      for (let i = 0; i < table.node.childCount; i++) {
        const cell = table.node.child(i).child(0);
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
