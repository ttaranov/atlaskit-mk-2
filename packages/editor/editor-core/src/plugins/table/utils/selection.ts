import { CellSelection } from 'prosemirror-tables';
import { EditorState } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';

export const getCellSelection = (
  state: EditorState,
): CellSelection | undefined => {
  const { selection } = state;
  if (selection instanceof CellSelection) {
    return selection;
  }
};

export const isHeaderRowSelected = (state: EditorState): boolean => {
  const cellSelection = getCellSelection(state);
  if (cellSelection && cellSelection.isRowSelection()) {
    const { $from } = cellSelection;
    const { tableHeader } = state.schema.nodes;
    for (let i = $from.depth; i > 0; i--) {
      if ($from.node(i).type === tableHeader) {
        return true;
      }
    }
  }

  return false;
};

export const getSelectedColumn = (
  state: EditorState,
): { anchor: number; head: number } => {
  const cellSelection = getCellSelection(state);
  const { $anchorCell, $headCell } = cellSelection!;
  const tableNode = $anchorCell.node(-1);
  const map = TableMap.get(tableNode);
  const start = $anchorCell.start(-1);
  const anchor = map.colCount($anchorCell.pos - start);
  const head = map.colCount($headCell.pos - start);

  return { anchor, head };
};

export const getSelectedRow = (
  state: EditorState,
): { anchor: number; head: number } => {
  const cellSelection = getCellSelection(state);
  const { $anchorCell, $headCell } = cellSelection!;
  const anchor = $anchorCell.index(-1);
  const head = $headCell.index(-1);

  return { anchor, head };
};
