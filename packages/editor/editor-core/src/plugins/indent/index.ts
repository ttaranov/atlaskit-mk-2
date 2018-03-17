import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import * as keymaps from '../../keymaps';
import * as commands from '../../commands';
import { trackAndInvoke } from '../../analytics';

export function createPlugin(): Plugin | undefined {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.indent.common!,
    trackAndInvoke('atlassian.editor.indent.keyboard', commands.changeIndent()),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdent.common!,
    trackAndInvoke(
      'atlassian.editor.outdent.keyboard',
      commands.changeIndent(-1),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    trackAndInvoke(
      'atlassian.editor.outdent.keyboard',
      commands.changeIndent(-1),
    ),
    list,
  );
  return keymap(list);
}

const indentPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 8800, plugin: () => createPlugin() }];
  },
};

export default indentPlugin;
