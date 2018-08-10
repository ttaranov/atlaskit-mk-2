import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { MediaPluginState, stateKey } from '../pm-plugins/main';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    removeMediaNode,
    list,
  );
  keymaps.bindKeymapWithCommand(keymaps.undo.common!, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common!, splitMediaGroup, list);
  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    splitMediaGroup,
    list,
  );

  return keymap(list);
}

function removeMediaNode(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  if (mediaPluginState.removeSelectedMediaNode()) {
    return true;
  }

  const { caption } = state.schema.nodes;

  /*if (state.selection.$from.parent.type === caption) {
    console.log('before', state.selection.$from.nodeBefore);
    if (state.selection.$from.nodeBefore === null) {
      const deleteFrom = state.selection.$from.before();
      const deleteTo = state.selection.$to.after();

      console.warn('doing the delete from', deleteFrom, 'to', deleteTo);

      dispatch(state.tr.delete(deleteFrom, deleteTo));
      return true;
    }
  }*/

  return false;
}

function ignoreLinksInSteps(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  mediaPluginState.ignoreLinks = true;
  return false;
}

function splitMediaGroup(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  return mediaPluginState.splitMediaGroup();
}

export default keymapPlugin;
