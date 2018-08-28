import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin, EditorState } from 'prosemirror-state';
import {
  chainCommands,
  deleteSelection,
  selectNodeBackward,
} from 'prosemirror-commands';

// Need to change the name, this a temporary name
function removeEmptyParagraph(state: EditorState, dispatch, view) {
  // TODO
  return true;
}

export function keymapPlugin(schema: Schema): Plugin | undefined {
  return keymap({
    Backspace: chainCommands(
      deleteSelection,
      removeEmptyParagraph,
      selectNodeBackward,
    ),
  });
}

export default keymapPlugin;
