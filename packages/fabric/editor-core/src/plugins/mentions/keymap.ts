import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../keymaps';
import { MentionsState } from './';
import pluginKey from './plugin-key';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectPrevious();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectNext();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectCurrent(keymaps.enter.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
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
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.onSelectCurrent(keymaps.tab.common);
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
      if (!mentionsPlugin.queryActive) {
        return false;
      }

      return mentionsPlugin.dismiss();
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.space.common!,
    (state: any, dispatch) => {
      const mentionsPlugin = pluginKey.getState(state) as MentionsState;
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
