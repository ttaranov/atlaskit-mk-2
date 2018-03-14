import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';

export function keymapPlugin(schema: Schema): Plugin | undefined {
  return keymap({
    Enter: (state: EditorState, dispatch) => {
      const { selection, schema: { nodes } } = state;
      const { $from, $to } = selection;
      const node = $from.node($from.depth);
      if (
        node &&
        node.type === nodes.codeBlock &&
        node.textContent.slice(node.textContent.length - 1) === '\n'
      ) {
        const tr = state.tr
          .split($to.pos)
          .setBlockType($to.pos + 2, $to.pos + 2, nodes.paragraph)
          .delete($from.pos - 1, $from.pos);
        dispatch(tr);
        return true;
      }
      return false;
    },
    Backspace: (state: EditorState, dispatch) => {
      const { selection, tr, schema: { nodes } } = state;
      if (!selection.empty || selection.from !== 1) {
        return false;
      }

      const { $anchor } = selection;
      const node = $anchor.node($anchor.depth);
      if (node && node.type === nodes.codeBlock) {
        tr.setBlockType($anchor.pos, $anchor.pos, nodes.paragraph);
        dispatch(tr);
        return true;
      }
      return false;
    },
  });
}

export default keymapPlugin;
