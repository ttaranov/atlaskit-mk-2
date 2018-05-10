import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { DecorationSet } from 'prosemirror-view';
import { TableMap } from 'prosemirror-tables';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
  addColumnAt,
  removeRowAt,
  addRowAt,
} from 'prosemirror-utils';
import { pluginKey as hoverSelectionPluginKey } from './pm-plugins/hover-selection-plugin';
import { stateKey as tablePluginKey } from './pm-plugins/main';
import {
  createHoverDecorationSet,
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
} from './utils';
import { Command } from '../../types';
import { analyticsService } from '../../analytics';

export const resetHoverSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(hoverSelectionPluginKey, {
      decorationSet: DecorationSet.empty,
      isTableHovered: false,
    }),
  );
  return true;
};

export const hoverColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = getCellsInColumn(column)(state.selection)!;
    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state),
      }),
    );
    return true;
  }
  return false;
};

export const hoverRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = getCellsInRow(row)(state.selection)!;
    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state),
      }),
    );
    return true;
  }
  return false;
};

export const hoverTable: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (table) {
    const cells = getCellsInTable(state.selection)!;
    dispatch(
      state.tr.setMeta(hoverSelectionPluginKey, {
        decorationSet: createHoverDecorationSet(cells, state),
        isTableHovered: true,
      }),
    );
    return true;
  }
  return false;
};

export const clearSelection: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setSelection(Selection.near(state.selection.$from)));
  return true;
};

export const toggleSummaryRow: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);

  if (!table) {
    return false;
  }

  // remove summary row, assume its last row for now
  if (!!table.node.attrs.isSummaryRowEnabled) {
    table.node.attrs.isSummaryRowEnabled = false;
    dispatch(removeRowAt(table.node.childCount - 1)(state.tr));
    return true;
  }
  // calculate summary for each col
  const summary: any[] = [];
  for (let i = 0, rowCount = table.node.childCount; i < rowCount; i++) {
    const row = table.node.child(i);

    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      let colSummary: any = summary[j];

      if (
        cell.attrs.cellType === 'number' ||
        cell.attrs.cellType === 'currency'
      ) {
        let cellNumber = parseInt(cell.textContent);
        colSummary = colSummary ? colSummary + cellNumber : cellNumber;
      } else if (cell.attrs.cellType === 'text') {
        colSummary = '';
      } else if (cell.attrs.cellType === 'mention') {
        let mentionCount = 0;
        if (
          cell.child(0).type.name === 'paragraph' &&
          cell.child(0).childCount > 0
        ) {
          mentionCount = 1;
        }
        colSummary = colSummary ? colSummary + mentionCount : mentionCount;
      } else if (cell.attrs.cellType === 'checkbox') {
        let actionCount = 0;
        if (
          cell.child(0).type.name === 'paragraph' &&
          cell.child(0).childCount > 0
        ) {
          let firstChild = cell.child(0).child(0);
          // only count unchecked actions
          if (firstChild.type.name === 'checkbox' && !firstChild.attrs.checked)
            actionCount = 1;
        }
        colSummary = colSummary ? colSummary + actionCount : actionCount;
      }

      summary[j] = colSummary;
    }
  }
  // console.log("summary");
  // console.log(summary);

  table.node.attrs.isSummaryRowEnabled = true;
  let tr = addRowAt(table.node.childCount)(state.tr);

  // fill in summary - TODO this is not inserting in the correct pos atm
  const cells = getCellsInRow(table.node.childCount - 1)(tr.selection)!;
  cells.forEach((cell, index) => {
    if (summary[index]) {
      tr = tr.insert(cell.pos + 1, state.schema.text(`${summary[index]}`));
    }
  });
  dispatch(tr);
  return true;
};

export const toggleHeaderRow: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  let { tr } = state;
  const map = TableMap.get(table.node);
  const { tableHeader, tableCell } = state.schema.nodes;
  const { isNumberColumnEnabled } = table.node.attrs;
  const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
  const isHeaderColumnEnabled = checkIfHeaderColumnEnabled(state);
  const type = isHeaderRowEnabled ? tableCell : tableHeader;

  for (let column = 0; column < table.node.child(0).childCount; column++) {
    // skip header column
    if (
      isHeaderColumnEnabled &&
      ((isNumberColumnEnabled && column === 1) ||
        (!isNumberColumnEnabled && column === 0))
    ) {
      continue;
    }
    const from = tr.mapping.map(table.pos + map.map[column]);
    const cell = table.node.child(0).child(column);
    // empty first cell of the number column when converting to header row (remove "1")
    if (!isHeaderRowEnabled && isNumberColumnEnabled && column === 0) {
      tr.replaceWith(
        from,
        from + cell.nodeSize,
        tableHeader.createAndFill(cell.attrs)!,
      );
    } else {
      tr.setNodeMarkup(
        from,
        type,
        Object.assign({}, cell.attrs, { cellType: 'text' }),
      );
    }
  }

  if (isHeaderRowEnabled) {
    tr = ensureCellTypes(0, state.schema)(tr);
  }

  dispatch(tr);
  return true;
};

export const toggleHeaderColumn: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const { tr } = state;
  const map = TableMap.get(table.node);
  const { tableHeader, tableCell } = state.schema.nodes;
  const type = checkIfHeaderColumnEnabled(state) ? tableCell : tableHeader;

  // skip header row
  const startIndex = checkIfHeaderRowEnabled(state) ? 1 : 0;
  for (let row = startIndex; row < table.node.childCount; row++) {
    const column = table.node.attrs.isNumberColumnEnabled ? 1 : 0;
    const cell = table.node.child(row).child(column);
    tr.setNodeMarkup(
      table.pos + map.map[column + row * map.width],
      type,
      Object.assign({}, cell.attrs, { cellType: 'text' }),
    );
  }
  dispatch(tr);
  return true;
};

export const toggleNumberColumn: Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { tr } = state;
  const { tableNode } = tablePluginKey.getState(state);
  const map = TableMap.get(tableNode);
  const { pos: start } = findTable(state.selection)!;

  if (tableNode.attrs.isNumberColumnEnabled) {
    // delete existing number column
    const mapStart = tr.mapping.maps.length;
    for (let i = 0, count = tableNode.childCount; i < count; i++) {
      const cell = tableNode.child(i).child(0);
      const pos = map.positionAt(i, 0, tableNode);
      const from = tr.mapping.slice(mapStart).map(start + pos);
      tr.delete(from, from + cell.nodeSize);
    }
    tr.setNodeMarkup(start - 1, state.schema.nodes.table, {
      ...tableNode.attrs,
      isNumberColumnEnabled: false,
    });
    dispatch(tr);
  } else {
    // insert number column
    let index = 1;
    let inserted = false;
    const { tableHeader, tableCell, paragraph } = state.schema.nodes;
    const isHeaderRowEnabled = checkIfHeaderRowEnabled(state);
    for (let i = 0, count = tableNode.childCount; i < count; i++) {
      const cell = tableNode.child(i).child(0);
      const from = map.positionAt(i, 0, tableNode);
      const content =
        cell.type === tableHeader && i === 0
          ? null
          : paragraph.createChecked({}, state.schema.text(`${index++}`));
      const type = isHeaderRowEnabled && i === 0 ? tableHeader : tableCell;
      if (content) {
        inserted = true;
      }
      tr.insert(tr.mapping.map(start + from), type.create({}, content!));
    }
    if (inserted) {
      tr.setNodeMarkup(start - 1, state.schema.nodes.table, {
        ...tableNode.attrs,
        isNumberColumnEnabled: true,
      });
      dispatch(tr);
    }
  }
  return true;
};

export const insertColumn = (column: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = addColumnAt(column)(state.tr);
  const table = findTable(tr.selection)!;
  // move the cursor to the newly created column
  const pos = TableMap.get(table.node).positionAt(0, column, table.node);
  dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.pos + pos))));
  analyticsService.trackEvent('atlassian.editor.format.table.column.button');
  return true;
};

export const insertRow = (row: number): Command => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = addRowAt(row)(state.tr);
  const table = findTable(tr.selection)!;
  if (!table) {
    return false;
  }
  // move the cursor to the newly created row
  const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
  tr.setSelection(Selection.near(tr.doc.resolve(table.pos + pos)));
  dispatch(ensureCellTypes(row, state.schema)(tr));
  analyticsService.trackEvent('atlassian.editor.format.table.row.button');
  return true;
};

export const ensureCellTypes = (rowIndex: number, schema: Schema) => (
  tr: Transaction,
): Transaction => {
  // getting cells of a row containing all tableCells so that we know what cellTypes should be for the new row
  const originalTable = findTable(tr.selection)!;
  let cells: { pos: number; node: PMNode }[] | undefined = [];
  for (let i = 0, count = originalTable.node.childCount; i < count; i++) {
    const row = originalTable.node.child(i);
    const cell = row.nodeAt(0);
    if (
      cell &&
      cell.type === schema.nodes.tableCell &&
      cell.attrs.cellType !== 'text'
    ) {
      cells = getCellsInRow(i)(tr.selection);
    }
  }

  // no special cell types found
  if (!cells || !cells.length) {
    return tr;
  }

  const nodemap = {
    slider: schema.nodes.slider,
    checkbox: schema.nodes.checkbox,
    decision: null,
  };

  const newCells = getCellsInRow(rowIndex)(tr.selection)!;

  for (let i = newCells.length - 1; i >= 0; i--) {
    const cell = newCells[i];
    const { cellType } = cells![i].node.attrs;

    tr = tr.setNodeMarkup(
      cell.pos - 1,
      cell.node.type,
      Object.assign({}, cell.node.attrs, {
        cellType,
      }),
    );

    // apply filldown
    if (Object.keys(nodemap).indexOf(cells![i].node.attrs.cellType) !== -1) {
      let node;
      if (cellType === 'decision') {
        node = schema.nodes.decisionList.createAndFill();
      } else {
        node = nodemap[cellType].createChecked();
      }

      tr = tr.insert(cell.pos + 1, node);
    }
  }

  return tr;
};
