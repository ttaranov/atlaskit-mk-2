import { Fragment, Node, Schema, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { Decoration, EditorView } from 'prosemirror-view';
import { TableState } from './';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TableFloatingControls from '../../ui/TableFloatingControls';

export interface TableRelativePosition {
  from: number;
  to: number;
}

export const getColumnPos = (column, tableNode: Node): TableRelativePosition => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(0, column, tableNode);
  const to = map.positionAt(map.height - 1, column, tableNode);
  return {from, to};
};

export const getRowPos = (row, tableNode: Node): TableRelativePosition => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(row, 0, tableNode);
  const to = map.positionAt(row, map.width - 1, tableNode);
  return {from, to};
};

export const getTablePos = (tableNode: Node): TableRelativePosition => {
  const map = TableMap.get(tableNode);
  const from = map.positionAt(0, 0, tableNode);
  const to = map.positionAt(map.height - 1, map.width - 1, tableNode);
  return {from, to};
};

export const createTableNode = (rows: number, columns: number, schema: Schema): Node => {
  const { table, tableRow, tableCell, tableHeader } = schema.nodes;
  const rowNodes: Node[] = [];

  for (let i = 0; i < rows; i ++) {
    const cell = i === 0 ? tableHeader : tableCell;
    const cellNodes: Node[] = [];
    for (let j = 0; j < columns; j ++) {
      cellNodes.push(cell.createAndFill()!);
    }
    rowNodes.push(tableRow.create(undefined, Fragment.from(cellNodes)));
  }
  return table.create(undefined, Fragment.from(rowNodes));
};

export const isIsolating = (node: Node): boolean => {
  return !!node.type.spec.isolating;
};

export interface SelectedCells {
  anchor: number;
  head: number;
}

export const getSelectedColumn = (state: EditorState, map: TableMap): SelectedCells => {
  const { $anchorCell, $headCell } = state.selection as any; // TODO: Fix types (ED-2987)
  const start = $anchorCell.start(-1);
  const anchor = map.colCount($anchorCell.pos - start);
  const head = map.colCount($headCell.pos - start);
  return { anchor, head };
};

export const getSelectedRow = (state: EditorState): SelectedCells => {
  const { $anchorCell, $headCell } = state.selection as any; // TODO: Fix types (ED-2987)
  const anchor = $anchorCell.index(-1);
  const head = $headCell.index(-1);

  return { anchor, head };
};

export const containsTable = (view: EditorView, slice: Slice): boolean => {
  const { table } = view.state.schema.nodes;
  let tablePresent = false;
  slice.content.forEach(node => {
    if (node.type === table) {
      tablePresent = true;
    }
  });
  return tablePresent;
};

export const containsTableHeader = (view: EditorView, table: Node): boolean => {
  const { tableHeader } = view.state.schema.nodes;
  let headerPresent = false;
  table.content.forEach(row => {
    if (row.firstChild!.type === tableHeader) {
      headerPresent = true;
    }
  });
  return headerPresent;
};

export const createControlsDecoration = (pluginState: TableState, editorView: EditorView): Decoration[] => {
  const node = document.createElement('div');
  node.className = 'table-decoration';

  ReactDOM.render(
    <TableFloatingControls pluginState={pluginState} editorView={editorView} />,
    node
  );

  const pos = pluginState.tableStartPos() || 1;

  return [
    Decoration.widget(pos, node)
  ];
};

export const createHoverDecoration = (hoveredCells: {pos: number; node: Node}[]): Decoration[] => {
  return hoveredCells.map(cell => {
    return Decoration.node(cell.pos, cell.pos + cell.node!.nodeSize, {class: 'hoveredCell'});
  });
};
