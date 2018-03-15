import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import { trackAndInvoke } from '../../../analytics';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertRule.common!,
    trackAndInvoke(
      'atlassian.editor.format.horizontalrule.keyboard',
      commands.insertRule(),
    ),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state: any, dispatch) => {
      return true;
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
