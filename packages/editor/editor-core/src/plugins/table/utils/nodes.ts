import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { findTable } from 'prosemirror-utils';

export const isIsolating = (node: PmNode): boolean => {
  return !!node.type.spec.isolating;
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

export const checkIfSummaryRowEnabled = (state: EditorState): boolean =>
  filterNearSelection(
    state,
    findTable,
    (_, table) => !!table.attrs.isSummaryRowEnabled,
    false,
  );

export const toFixed = value => {
  if (typeof value === 'number' && value % 1 !== 0) {
    return Number(value.toFixed(1));
  }
  return value;
};

export const maybeCreateText = schema => value => {
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
      } else if (cellType === 'slider') {
        let firstChild = cell.child(0).child(0);
        let cellNumber = parseFloat(firstChild.attrs.value) || 0;
        colValue = numberOps[operators[j]](colValue, cellNumber);
        colSummary.summaryType = 'total';
      } else if (cellType === 'text' || cellType === 'date') {
        colValue = '';
        colSummary.summaryType = '';
      } else if (cellType === 'mention' || cellType === 'emoji') {
        if (
          cell.child(0).type.name === 'paragraph' &&
          cell.child(0).childCount > 0 &&
          (cell.child(0).child(0).type.name === 'mention' ||
            cell.child(0).child(0).type.name === 'emoji')
        ) {
          const node = cell.child(0).child(0);
          colValue = colValue
            ? colValue.set(node.attrs.id, {
                node,
                count: (colValue.get(node.attrs.id) || { count: 0 }).count + 1,
              })
            : new Map([[node.attrs.id, { node, count: 1 }]]);
        }
        colSummary.summaryType = cellType === 'mention' ? 'people' : 'count';
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

interface MappableSummary {
  summaryType: string;
  value: Map<string, { node: PmNode; count: number }>;
}

function isMappableSummary(summary): summary is MappableSummary {
  return summary.summaryType === 'people' || summary.summaryType === 'count';
}

export const renderSummary = schema => summary => {
  const { value } = summary;
  const { paragraph } = schema.nodes;
  const createContent = maybeCreateText(schema);
  let content;

  if (isMappableSummary(summary)) {
    const values = summary.value ? Array.from(summary.value.values()) : [];
    content = values.length
      ? values.map(x =>
          paragraph.createChecked({}, [x.node, schema.text(` ${x.count}`)]),
        )
      : paragraph.create();
  } else {
    // Handle average
    value && value.value ? value.value / value.count : value;
    content = paragraph.createChecked({}, createContent(value));
  }

  return content;
};
