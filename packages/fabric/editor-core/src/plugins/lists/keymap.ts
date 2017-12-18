import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../keymaps';
import * as commands from '../../commands';
import { trackAndInvoke } from '../../analytics';
import { enterKeyCommand } from './commands';
import { EditorAppearance } from '../../editor/types/editor-props';

export function keymapPlugin(
  schema: Schema,
  appearance?: EditorAppearance,
): Plugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleOrderedList)!,
    trackAndInvoke(
      'atlassian.editor.format.list.numbered.keyboard',
      commands.toggleOrderedList(),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleBulletList)!,
    trackAndInvoke(
      'atlassian.editor.format.list.bullet.keyboard',
      commands.toggleBulletList(),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.indentList.common!!,
    trackAndInvoke(
      'atlassian.editor.format.list.indent.keyboard',
      commands.indentList(),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdentList.common!!,
    trackAndInvoke(
      'atlassian.editor.format.list.outdent.keyboard',
      commands.outdentList(),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(keymaps.enter.common!!, enterKeyCommand, list);
  if (appearance === 'message') {
    keymaps.bindKeymapWithCommand(
      keymaps.insertNewLine.common!!,
      enterKeyCommand,
      list,
    );
  }

  return keymap(list);
}

export default keymapPlugin;
