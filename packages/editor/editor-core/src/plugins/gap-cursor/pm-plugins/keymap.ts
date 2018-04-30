import { keymap } from 'prosemirror-keymap';
import { Plugin, Transaction, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as keymaps from '../../../keymaps';
import { Direction, arrow, deleteNode } from '../actions';

export default function keymapPlugin(): Plugin {
  const map = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveLeft.common!,
    (
      state: EditorState,
      dispatch: (tr: Transaction) => void,
      view?: EditorView,
    ) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.BACKWARD, endOfTextblock)(state, dispatch);
    },
    map,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveRight.common!,
    (
      state: EditorState,
      dispatch: (tr: Transaction) => void,
      view?: EditorView,
    ) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.FORWARD, endOfTextblock)(state, dispatch);
    },
    map,
  );

  // default PM's Backspace doesn't handle removing block nodes when cursor is after it
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    deleteNode(Direction.BACKWARD),
    map,
  );

  // handle Delete key (remove node before the cursor)
  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!,
    deleteNode(Direction.FORWARD),
    map,
  );

  return keymap(map);
}
