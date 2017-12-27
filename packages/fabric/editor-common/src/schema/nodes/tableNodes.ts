import { Node as PmNode } from 'prosemirror-model';
import { TableCellContent } from './doc';

const getCellAttrs = (dom: HTMLElement) => {
  const widthAttr = dom.getAttribute('data-colwidth');
  const width =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(',').map(str => Number(str))
      : null;
  const colspan = Number(dom.getAttribute('colspan') || 1);

  return {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: width && width.length === colspan ? width : null,
    background: dom.style.backgroundColor || null,
  };
};

const setCellAttrs = (node: PmNode) => {
  const attrs: any = {};
  if (node.attrs.colspan !== 1) {
    attrs.colspan = node.attrs.colspan;
  }
  if (node.attrs.rowspan !== 1) {
    attrs.rowspan = node.attrs.rowspan;
  }
  if (node.attrs.colwidth) {
    attrs['data-colwidth'] = node.attrs.colwidth.join(',');
  }
  if (node.attrs.background) {
    attrs.style =
      (attrs.style || '') + `backgroundcolor: ${node.attrs.background};`;
  }

  return attrs;
};

/**
 * @name table_node
 */
export interface Table {
  type: 'table';
  /**
   * @minItems 1
   */
  content: Array<TableRow>;
}

/**
 * @name table_row_node
 */
export interface TableRow {
  type: 'tableRow';
  /**
   * @minItems 1
   */
  content: Array<TableHeader> | Array<TableCell>;
}

/**
 * @name table_cell_node
 */
export interface TableCell {
  type: 'tableCell';
  attrs: CellAttributes;
  /**
   * @minItems 1
   */
  content: TableCellContent;
}

/**
 * @name table_header_node
 */
export interface TableHeader {
  type: 'tableHeader';
  attrs: CellAttributes;
  /**
   * @minItems 1
   */
  content: TableCellContent;
}

export interface CellAttributes {
  colspan: number;
  rowspan: number;
  colwidth?: number;
  background?: string;
}

// "any", because NodeSpec doesn't support "tableRole" yet
export const table: any = {
  content: 'tableRow+',
  tableRole: 'table',
  isolating: true,
  group: 'block',
  parseDOM: [{ tag: 'table' }],
  toDOM() {
    return ['table', ['tbody', 0]];
  },
};

export const tableRow: any = {
  content: '(tableCell | tableHeader)+',
  tableRole: 'row',
  parseDOM: [{ tag: 'tr' }],
  toDOM() {
    return ['tr', 0];
  },
};

const cellAttrs = {
  colspan: { default: 1 },
  rowspan: { default: 1 },
  colwidth: { default: null },
  background: { default: null },
};

export const tableCell: any = {
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | applicationCard | decisionList | taskList | extension | bodiedExtension)+',
  attrs: cellAttrs,
  tableRole: 'cell',
  isolating: true,
  parseDOM: [
    {
      tag: 'td',
      getAttrs: (dom: HTMLElement) => getCellAttrs(dom),
    },
  ],
  toDOM(node) {
    return ['td', setCellAttrs(node), 0];
  },
};

export const tableHeader: any = {
  content: 'block+',
  attrs: cellAttrs,
  tableRole: 'header_cell',
  isolating: true,
  parseDOM: [
    {
      tag: 'th',
      getAttrs: (dom: HTMLElement) => getCellAttrs(dom),
    },
  ],
  toDOM(node) {
    return ['th', setCellAttrs(node), 0];
  },
};
