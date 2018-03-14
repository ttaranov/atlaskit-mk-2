import { EditorState } from 'prosemirror-state';
import { Node as PmNode, ResolvedPos } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';

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
  const cellIndex = column + (tableNode.childCount - 1) * map.width;
  const to = map.map[cellIndex];
  return { from, to };
};

export const getRowPos = (
  row,
  tableNode: PmNode,
): { from: number; to: number } => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(row, 0, tableNode);
  const cellIndex = (row + 1) * map.width - 1;
  const to = map.map[cellIndex];
  return { from, to };
};

export const getTablePos = (
  tableNode: PmNode,
): { from: number; to: number } => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(0, 0, tableNode);
  const cellIndex = map.height * map.width - 1;
  const to = map.map[cellIndex];

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
