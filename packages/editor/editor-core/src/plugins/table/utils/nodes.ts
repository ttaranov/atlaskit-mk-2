import { Fragment, Node as PmNode, Schema, Slice } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable } from 'prosemirror-utils';

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

export const canInsertTable = (state: EditorState): boolean => {
  const {
    selection: { $from },
    schema: { marks: { code }, nodes: { codeBlock } },
  } = state;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    // inline code and codeBlock are excluded
    if (
      node.type === codeBlock ||
      (code && $from.marks().some(mark => mark.type === code))
    ) {
      return false;
    }
  }
  return true;
};

export const containsTable = (schema: Schema, slice: Slice): boolean => {
  const { table } = schema.nodes;
  let contains = false;
  slice.content.forEach(node => {
    if (node.type === table) {
      contains = true;
    }
  });
  return contains;
};

export const containsHeaderColumn = (
  state: EditorState,
  table: PmNode,
): boolean => {
  const { tableHeader } = state.schema.nodes;
  let contains = true;
  table.content.forEach(row => {
    if (row.firstChild!.type !== tableHeader) {
      contains = false;
    }
  });
  return contains;
};

export const containsHeaderRow = (
  state: EditorState,
  table: PmNode,
): boolean => {
  const map = TableMap.get(table);
  for (let i = 0; i < map.width; i++) {
    const cell = table.nodeAt(map.map[i]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export function filterNearSelection<T, U>(
  state: EditorState,
  findNode: (selection: Selection) => { pos: number; node: PmNode } | undefined,
  predicate: (state: EditorState, node: PmNode, pos?: number) => T,
  defaultValue: U,
): T | U {
  const found = findNode(state.selection);
  if (!found) {
    return defaultValue;
  }

  return predicate(state, found.node, found.pos);
}

export const checkIfHeaderColumnEnabled = (state: EditorState): boolean =>
  filterNearSelection(state, findTable, containsHeaderColumn, false);

export const checkIfHeaderRowEnabled = (state: EditorState): boolean =>
  filterNearSelection(state, findTable, containsHeaderRow, false);

export const checkIfNumberColumnEnabled = (state: EditorState): boolean =>
  filterNearSelection(
    state,
    findTable,
    (_, table) => !!table.attrs.isNumberColumnEnabled,
    false,
  );
