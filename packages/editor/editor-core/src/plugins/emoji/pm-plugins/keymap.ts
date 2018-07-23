import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { EmojiState, emojiPluginKey } from './main';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.onSelectPrevious();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.onSelectNext();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.onSelectCurrent(keymaps.enter.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      emojisPlugin.onSelectCurrent(keymaps.insertNewLine.common);
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.onSelectCurrent(keymaps.tab.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.dismiss();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.space.common!,
    (state, dispatch) => {
      const emojisPlugin = emojiPluginKey.getState(state) as EmojiState;
      if (!emojisPlugin.queryActive) {
        return false;
      }

      return emojisPlugin.trySelectCurrentWithSpace(keymaps.space.common);
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
