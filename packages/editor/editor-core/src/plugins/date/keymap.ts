import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { closeDatePicker } from './actions';
import * as keymaps from '../../keymaps';
import { pluginKey, DateState } from './plugin';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    (state, dispatch) => {
      const datePlugin = pluginKey.getState(state) as DateState;
      if (!datePlugin.showDatePickerAt) {
        return false;
      }

      closeDatePicker()(state, dispatch);
      return true;
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
