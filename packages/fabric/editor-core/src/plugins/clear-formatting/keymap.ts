import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../keymaps';
import { clearFormatting } from './commands';
import { trackAndInvoke } from '../../analytics';

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.clearFormatting.common!,
    trackAndInvoke('atlassian.editor.format.clear.keyboard',
    clearFormatting()
  ), list);

  return keymap(list);
}

export default keymapPlugin;
