import { keymap } from 'prosemirror-keymap';
import { ResolvedPos, Schema } from 'prosemirror-model';
import { EditorState, Selection, Transaction, Plugin } from 'prosemirror-state';

// tries to find a valid cursor position
const setTextSelection = (pos: number) => (tr: Transaction) => {
  const newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);
  if (newSelection) {
    tr.setSelection(newSelection);
  }
  return tr;
};

export function keymapPlugin(schema: Schema): Plugin | undefined {
  const deleteCurrentItem = ($from: ResolvedPos, tr: Transaction) => {
    return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
  };

  const keymaps = {
    Backspace: (state: EditorState, dispatch) => {
      const {
        selection,
        schema: { nodes },
        tr,
      } = state;
      const { panel } = nodes;

      if (!panel) {
        return false;
      }

      const { $from, $to } = selection;

      // Don't do anything if selection is a range
      if ($from.pos !== $to.pos) {
        return false;
      }

      // If not at the start of a panel, no joining will happen so allow default behaviour (backspacing characters etc..)
      if ($from.parentOffset !== 0) {
        return false;
      }

      const previousPos = tr.doc.resolve(
        Math.max(0, $from.before($from.depth) - 1),
      );

      const previousNodeType =
        previousPos.pos > 0 && previousPos.node(1) && previousPos.node(1).type;
      const parentNodeType = $from.node(1).type;
      const previousNodeIsPanel = previousNodeType === panel;
      const parentNodeIsPanel = parentNodeType === panel;

      // Stops merging panels when deleting empty paragraph in between
      if (previousNodeIsPanel && !parentNodeIsPanel) {
        const content = $from.node($from.depth).content;
        const insertPos = previousPos.pos - 1;
        deleteCurrentItem($from, tr).insert(insertPos, content);
        dispatch(setTextSelection(insertPos)(tr).scrollIntoView());
        return true;
      }

      const nodeType = $from.node().type;
      if (nodeType !== panel) {
        return false;
      }

      return true;
    },
  };
  return keymap(keymaps);
}

export default keymapPlugin;
