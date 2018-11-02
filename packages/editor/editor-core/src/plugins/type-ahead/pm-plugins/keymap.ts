import { keymap } from 'prosemirror-keymap';
import { Plugin, EditorState } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { pluginKey, ACTIONS } from './main';
import {
  selectCurrentItem,
  selectSingleItemOrDismiss,
} from '../commands/select-item';
import { dismissCommand } from '../commands/dismiss';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem()(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      dispatch(state.tr.setMeta(pluginKey, { action: ACTIONS.SELECT_PREV }));
      return true;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      dispatch(state.tr.setMeta(pluginKey, { action: ACTIONS.SELECT_NEXT }));
      return true;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem()(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }
      return selectCurrentItem()(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (!pluginState || !pluginState.active) {
        return false;
      }

      return dismissCommand()(state, dispatch);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.space.common!,
    (state: EditorState, dispatch) => {
      const pluginState = pluginKey.getState(state);
      if (pluginState && pluginState.active) {
        return selectSingleItemOrDismiss()(state, dispatch);
      }
      return false;
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
