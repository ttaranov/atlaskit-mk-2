import { EditorState } from 'prosemirror-state';
import { Node as PmNode, ResolvedPos } from 'prosemirror-model';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { stateKey as tablePluginKey } from '../../../../plugins/table';

export const tableStartPos = (state: EditorState): number => {
  const { $from } = state.selection;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === state.schema.nodes.table) {
      return $from.start(i);
    }
  }

  return 0;
};

export const getColumnPos = (
  column,
  tableNode: PmNode,
): { from: number; to: number } => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(0, column, tableNode);
  const to = map.positionAt(map.height - 1, column, tableNode);

  return { from, to };
};

export const getRowPos = (
  row,
  tableNode: PmNode,
): { from: number; to: number } => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(row, 0, tableNode);
  const to = map.positionAt(row, map.width - 1, tableNode);

  return { from, to };
};

export const getTablePos = (
  tableNode: PmNode,
): { from: number; to: number } => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(0, 0, tableNode);
  const to = map.positionAt(map.height - 1, map.width - 1, tableNode);

  return { from, to };
};

export const getCellStartPos = (
  state: EditorState,
  $pos?: ResolvedPos,
): number | undefined => {
  const { tableCell, tableHeader } = state.schema.nodes;
  $pos = $pos || state.selection.$from;

  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (node.type === tableCell || node.type === tableHeader) {
      return $pos.start(i);
    }
  }
};

export const getFirstSelectedCellPos = (
  state: EditorState,
): number | undefined => {
  const { tableNode } = tablePluginKey.getState(state);
  const offset = tableStartPos(state);
  const { $anchorCell, $headCell } = (state.selection as any) as CellSelection;
  const map = TableMap.get(tableNode);
  const start = $anchorCell.start(-1);
  // array of selected cells positions
  const cells = map.cellsInRect(
    map.rectBetween($anchorCell.pos - start, $headCell.pos - start),
  );
  // first selected cell position
  const firstCellPos = cells[0] + offset + 1;

  return getCellStartPos(state, state.doc.resolve(firstCellPos));
};
