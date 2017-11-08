import { keydownHandler } from 'prosemirror-keymap';
import tableCommands from './commands';
import * as keymaps from '../../keymaps';
import { TableState } from './';

export function keymapHandler(pluginState: TableState): Function {
  const list = {};

  keymaps.bindKeymapWithCommand(keymaps.nextCell.common!, tableCommands.goToNextCell(1), list);
  keymaps.bindKeymapWithCommand(keymaps.previousCell.common!, tableCommands.goToNextCell(-1), list);
  keymaps.bindKeymapWithCommand(keymaps.toggleTable.common!, tableCommands.createTable(), list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common!, tableCommands.emptyCells(), list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common!, tableCommands.moveCursorBackward(), list);

  return keydownHandler(list);
}

export default keymapHandler;
