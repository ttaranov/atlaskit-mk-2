import { Fragment, Node as PmNode, Schema, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
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

export const checkIfHeaderRowEnabled = (state: EditorState): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const map = TableMap.get(table.node);
  for (let i = 0; i < map.width; i++) {
    const cell = table.node.nodeAt(map.map[i]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export const checkIfHeaderColumnEnabled = (state: EditorState): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const map = TableMap.get(table.node);
  for (let i = 0; i < map.height; i++) {
    // if number column is enabled, second column becomes header (next to the number column)
    const column = table.node.attrs.isNumberColumnEnabled ? 1 : 0;
    const cell = table.node.nodeAt(map.map[column + i * map.width]);
    if (cell && cell.type !== state.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export const checkIfNumberColumnEnabled = (state: EditorState): boolean => {
  const table = findTable(state.selection);
  return !!(table && table.node.attrs.isNumberColumnEnabled);
};

export const checkIfSummaryRowEnabled = (state: EditorState): boolean => {
  const table = findTable(state.selection);
  return !!(table && table.node.attrs.isSummaryRowEnabled);
};

export const toFixed = value => {
  if (typeof value === 'number' && value % 1 !== 0) {
    return Number(value.toFixed(1));
  }
  return value;
};

export const maybeCreateText = schema => value => {
  if (value instanceof Object) {
    let str = '';
    for (var key in value) {
      if (key.indexOf('circle') !== -1) str += '🔴';
      else if (key.indexOf('check') !== -1) str += '✅';
      str += ' ' + value[key] + '\n';
    }
    return schema.text(`${toFixed(str)}`);
  }
  return value !== null && value !== ''
    ? schema.text(`${toFixed(value)}`)
    : undefined;
};

const numberOps = {
  total: (l = 0, r) => l + r,
  average: (l = { value: 0, count: 0 }, r) => ({
    value: l.value + r,
    count: l.count + 1,
  }),
  min: (l = Infinity, r) => Math.min(l, r),
  max: (l = 0, r) => Math.max(l, r),
};

export const calculateSummary = (table: PmNode) => {
  const summary: Array<any> = [];
  const operators: Array<string> = [];

  const lastChildIndex = table.childCount - 1;
  for (let i = lastChildIndex; i >= 0; i--) {
    const row = table.child(i);
    for (let j = 0, colsCount = row.childCount; j < colsCount; j++) {
      const cell = row.child(j);
      const { cellType } = cell.attrs;
      if (i === lastChildIndex) {
        operators[j] =
          cellType === 'summary' ? cell.attrs.summaryType : 'total';
        //default to total
        if (!operators[j]) operators[j] = 'total';
      }

      // TODO: pass schema
      if (cell.type.name === 'tableHeader') {
        continue;
      }
      let colSummary = summary[j] || {};
      let colValue: any = colSummary ? colSummary.value : null;

      if (cellType === 'number' || cellType === 'currency') {
        let cellNumber = parseFloat(cell.textContent) || 0;
        colValue = numberOps[operators[j]](colValue, cellNumber);
        colSummary.summaryType = 'total';
      } else if (cellType === 'emoji') {
        colValue = colValue || {};
        if (
          cell.child(0).type.name === 'paragraph' &&
          cell.child(0).childCount > 0
        ) {
          let childNode = cell.child(0).child(0);
          if (childNode.type.name === 'emoji') {
            let count = colValue[childNode.attrs.shortName] || 0;
            colValue[childNode.attrs.shortName] = count + 1;
          }
        }
        colSummary.summaryType = 'total';
      } else if (cellType === 'slider') {
        let firstChild = cell.child(0).child(0);
        let cellNumber = parseFloat(firstChild.attrs.value) || 0;
        colValue = numberOps[operators[j]](colValue, cellNumber);
        colSummary.summaryType = 'total';
      } else if (cellType === 'text') {
        colValue = '';
        colSummary.summaryType = '';
      } else if (cellType === 'mention') {
        let mentionCount = 0;
        if (
          cell.child(0).type.name === 'paragraph' &&
          cell.child(0).childCount > 0
        ) {
          mentionCount = 1;
        }
        colValue = colValue ? colValue + mentionCount : mentionCount;
        colSummary.summaryType = 'people';
      } else if (cellType === 'checkbox' || cellType === 'decision') {
        let count = 0;
        if (
          (cell.child(0).type.name === 'paragraph' ||
            cell.child(0).type.name === 'decisionList') &&
          cell.child(0).childCount > 0
        ) {
          let firstChild = cell.child(0).child(0);
          // only count unchecked actions and empty decisions
          if (firstChild.type.name === 'checkbox' && !firstChild.attrs.checked)
            count = 1;
          else if (
            firstChild.type.name === 'decisionItem' &&
            firstChild.content.size === 0
          )
            count = 1;
        }
        colValue = colValue ? colValue + count : count;
        colSummary.summaryType = 'remaining';
      }
      colSummary.value = colValue;
      summary[j] = colSummary;
    }
  }
  return summary;
};
