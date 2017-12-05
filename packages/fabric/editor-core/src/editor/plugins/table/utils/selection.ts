import { CellSelection } from 'prosemirror-tables';
import { stateKey as tablePluginKey } from '../../../../plugins/table';
import { EditorState } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';

export const getCellSelection = (
  state: EditorState
): CellSelection | undefined => {
  const { selection } = state;
  if (selection instanceof CellSelection) {
    return selection;
  }
};

export const isColumnSelected = (
  column: number,
  state: EditorState
): boolean => {
  const cellSelection = getCellSelection(state);
  const { tableNode } = tablePluginKey.getState(state);
  if (tableNode && cellSelection) {
    const map = TableMap.get(tableNode);
    const start = cellSelection.$anchorCell.start(-1);
    const anchor = map.colCount(cellSelection.$anchorCell.pos - start);
    const head = map.colCount(cellSelection.$headCell.pos - start);
    return (
      cellSelection.isColSelection() &&
      (column <= Math.max(anchor, head) && column >= Math.min(anchor, head))
    );
  }

  return false;
};

export const isRowSelected = (row: number, state: EditorState): boolean => {
  const cellSelection = getCellSelection(state);
  if (cellSelection) {
    const anchor = cellSelection.$anchorCell.index(-1);
    const head = cellSelection.$headCell.index(-1);
    return (
      cellSelection.isRowSelection() &&
      (row <= Math.max(anchor, head) && row >= Math.min(anchor, head))
    );
  }

  return false;
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

export const isTableSelected = (state: EditorState): boolean => {
  const cellSelection = getCellSelection(state);
  if (cellSelection) {
    return cellSelection.isColSelection() && cellSelection.isRowSelection();
  }

  return false;
};

export const getSelectedColumn = (
  state: EditorState
): { anchor: number; head: number } => {
  const { tableNode } = tablePluginKey.getState(state);
  const map = TableMap.get(tableNode);
  const { $anchorCell, $headCell } = (state.selection as any) as CellSelection;
  const start = $anchorCell.start(-1);
  const anchor = map.colCount($anchorCell.pos - start);
  const head = map.colCount($headCell.pos - start);

  return { anchor, head };
};

export const getSelectedRow = (
  state: EditorState
): { anchor: number; head: number } => {
  const { $anchorCell, $headCell } = (state.selection as any) as CellSelection;
  const anchor = $anchorCell.index(-1);
  const head = $headCell.index(-1);

  return { anchor, head };
};
