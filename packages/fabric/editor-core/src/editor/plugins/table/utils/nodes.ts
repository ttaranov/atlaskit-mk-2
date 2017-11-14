import { Fragment, Node as PmNode, Schema, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { getFirstSelectedCellPos, tableStartPos } from './position';

export const createTableNode = (
  rows: number,
  columns: number,
  schema: Schema
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
  table: PmNode
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

export const getFirstSelectedCellElement = (
  state: EditorState,
  docView: any
): HTMLElement | undefined => {
  const offset = getFirstSelectedCellPos(state);
  if (offset) {
    const { node } = docView.domFromPos(offset);
    if (node) {
      return node as HTMLElement;
    }
  }
};

export const getTableElement = (
  state: EditorState,
  docView: any
): HTMLElement | undefined => {
  const offset = tableStartPos(state);
  if (offset) {
    const { node } = docView.domFromPos(offset);
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
