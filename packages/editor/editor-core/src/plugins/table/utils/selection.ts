import { CellSelection } from 'prosemirror-tables';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { isCellSelection, findTable } from 'prosemirror-utils';

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const getSelectionRect = (selection: Selection): Rect | undefined => {
  const table = findTable(selection);
  if (!isCellSelection(selection) || !table) {
    return;
  }
  const map = TableMap.get(table.node);
  return map.rectBetween(
    (selection as any).$anchorCell.pos - table.start,
    (selection as any).$headCell.pos - table.start,
  );
};

export const getCellSelection = (
  state: EditorState,
): CellSelection | undefined => {
  const { selection } = state;
  if (selection instanceof CellSelection) {
    return selection;
  }
};

export const isHeaderRowSelected = (state: EditorState): boolean => {
  let isSelected = false;
  if (isCellSelection(state.selection)) {
    (state.selection as any).forEachCell(cell => {
      if (cell.type === state.schema.nodes.tableHeader) {
        isSelected = true;
      }
    });
  }
  return isSelected;
};
