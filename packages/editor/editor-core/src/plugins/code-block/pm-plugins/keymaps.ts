import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import { getCursor } from '../../../utils';

export function keymapPlugin(schema: Schema): Plugin | undefined {
  return keymap({
    Enter: (state: EditorState, dispatch) => {
      const {
        selection,
        schema: { nodes },
      } = state;
      const { $from, $to } = selection;
      const node = $from.node($from.depth);

      const selectionIsAtEndOfCodeBlock =
        node &&
        node.type === nodes.codeBlock &&
        $from.parentOffset === $from.parent.nodeSize - 2 && // cursor offset is at the end of block
        $from.indexAfter($from.depth) === node.childCount; // paragraph is the last child of code block
      const codeBlockEndsWithNewLine =
        node.lastChild &&
        node.lastChild.text &&
        node.lastChild.text.endsWith('\n');

      if (selectionIsAtEndOfCodeBlock && codeBlockEndsWithNewLine) {
        const tr = state.tr
          .split($to.pos)
          .setBlockType($to.pos + 2, $to.pos + 2, nodes.paragraph)
          .delete($from.pos - 1, $from.pos)
          .scrollIntoView();
        dispatch(tr);
        return true;
      }
      return false;
    },
    Backspace: (state: EditorState, dispatch) => {
      const $cursor = getCursor(state.selection);
      if (
        $cursor &&
        $cursor.pos === 1 &&
        $cursor.parent.type === state.schema.nodes.codeBlock
      ) {
        dispatch(
          state.tr.setBlockType(
            $cursor.pos,
            $cursor.pos,
            state.schema.nodes.paragraph,
          ),
        );
        return true;
      }
      return false;
    },
  });
}

export default keymapPlugin;
