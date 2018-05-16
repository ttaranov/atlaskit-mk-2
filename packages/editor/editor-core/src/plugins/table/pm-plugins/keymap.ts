import { keymap } from 'prosemirror-keymap';
import { Plugin, EditorState, Selection, Transaction } from 'prosemirror-state';
import { CellSelection } from 'prosemirror-tables';
import {
  emptyCell,
  findCellClosestToPos,
  isCellSelection,
} from 'prosemirror-utils';
import tableCommands from '../commands';
import * as keymaps from '../../../keymaps';
import { analyticsService } from '../../../analytics';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.nextCell.common!,
    tableCommands.goToNextCell(1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.previousCell.common!,
    tableCommands.goToNextCell(-1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.toggleTable.common!,
    tableCommands.createTable(),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    (state: EditorState, dispatch: (tr: Transaction) => void) => {
      if (!isCellSelection(state.selection)) {
        return false;
      }
      let { tr } = state;
      const selection = (tr.selection as any) as CellSelection;
      selection.forEachCell((node, pos) => {
        const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
        tr = emptyCell(findCellClosestToPos($pos)!, state.schema)(tr);
      });
      if (tr.docChanged) {
        const $pos = tr.doc.resolve(tr.mapping.map(selection.$headCell.pos));
        const textSelection = Selection.findFrom($pos, 1, true);
        if (textSelection) {
          tr.setSelection(textSelection);
        }
        dispatch(tr);
        analyticsService.trackEvent(
          'atlassian.editor.format.table.delete_content.keyboard',
        );
        return true;
      }
      return false;
    },
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    tableCommands.moveCursorBackward(),
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
