import { Fragment, Node as PmNode, Schema, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { tableStartPos } from './position';
import { TableMap } from 'prosemirror-tables';

export const createTableNode = (
  rows: number,
  columns: number,
  schema: Schema,
): PmNode => {
  const { table, tableRow, tableCell, tableHeader } = schema.nodes;
  const rowNodes: PmNode[] = [];
  for (let i = 0; i < rows; i++) {
    const cell = i === 0 ? tableHeader : tableCell;
    const cellNodes: PmNode[] = [];
    for (let j = 0; j < columns; j++) {
      cellNodes.push(cell.createAndFill()!);
    }
    rowNodes.push(tableRow.create(undefined, Fragment.from(cellNodes)));
  }
  return table.create(undefined, Fragment.from(rowNodes));
};

export const isIsolating = (node: PmNode): boolean => {
  return !!node.type.spec.isolating;
};

export const getCurrentCell = (state: EditorState): PmNode | undefined => {
  const { $from } = state.selection;
  const { tableCell, tableHeader } = state.schema.nodes;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === tableCell || node.type === tableHeader) {
      return node;
    }
  }
};

export const canInsertTable = (state: EditorState): boolean => {
  const {
    selection: { $from, to },
    schema: { marks: { code }, nodes: { codeBlock } },
  } = state;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    // inline code and codeBlock are excluded
    if (
      node.type === codeBlock ||
      (code && state.doc.rangeHasMark($from.pos, to, code))
    ) {
      return false;
    }
  }
  return true;
};

export const containsTable = (state: EditorState, slice: Slice): boolean => {
  const { table } = state.schema.nodes;
  let contains = false;
  slice.content.forEach(node => {
    if (node.type === table) {
      contains = true;
    }
  });
  return contains;
};

export const containsTableHeader = (
  state: EditorState,
  table: PmNode,
): boolean => {
  const { tableHeader } = state.schema.nodes;
  let contains = false;
  table.content.forEach(row => {
    if (row.firstChild!.type === tableHeader) {
      contains = true;
    }
  });
  return contains;
};

export const getTableElement = (
  state: EditorState,
  view: EditorView,
): HTMLElement | undefined => {
  const pos = tableStartPos(state);
  if (pos) {
    const { node } = view.domAtPos(pos);
    if (node) {
      return node.parentNode as HTMLElement;
    }
  }
};

export const getTableNode = (state: EditorState): PmNode | undefined => {
  const { $from } = state.selection;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (node.type === state.schema.nodes.table) {
      return node;
    }
  }
};

export const checkIfHeaderRowEnabled = (state: EditorState): boolean => {
  const tableNode = getTableNode(state);
  const map = TableMap.get(tableNode!);
  for (let i = 0; i < map.width; i++) {
    const cell = tableNode!.nodeAt(map.map[i]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export const checkIfHeaderColumnEnabled = (state: EditorState): boolean => {
  const tableNode = getTableNode(state);
  const map = TableMap.get(tableNode!);
  for (let i = 0; i < map.height; i++) {
    // if number column is enabled, second column becomes header (next to the number column)
    const column = tableNode!.attrs.isNumberColumnEnabled ? 1 : 0;
    const cell = tableNode!.nodeAt(map.map[column + i * map.width]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export const checkIfNumberColumnEnabled = (state: EditorState): boolean => {
  const tableNode = getTableNode(state);
  return !!tableNode!.attrs.isNumberColumnEnabled;
};
