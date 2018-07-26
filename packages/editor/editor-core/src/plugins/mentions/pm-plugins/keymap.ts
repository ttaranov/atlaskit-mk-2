import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { MentionsState, mentionPluginKey } from './main';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectPrevious();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectNext();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectCurrent(keymaps.enter.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      mentionsPlugin.onSelectCurrent(keymaps.insertNewLine.common);
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectCurrent(keymaps.tab.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.dismiss();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.space.common!,
    (state, dispatch) => {
      const mentionsPlugin = mentionPluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.trySelectCurrent(keymaps.space.common);
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
