import { Node as PmNode } from 'prosemirror-model';
import { TableCellContent } from './doc';
import {
  akColorN30,
  akColorB50,
  akColorT50,
  akColorP50,
  akColorR50,
  akColorG50,
  akColorY50,
} from '@atlaskit/util-shared-styles';
import { hexToRgba } from '../../utils';
import { akEditorTableCellBackgroundOpacity } from '../../styles';

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
    const { background } = node.attrs;
    const color =
      node.type.name === 'tableCell'
        ? hexToRgba(background, akEditorTableCellBackgroundOpacity)
        : background;
    attrs.style = (attrs.style || '') + `background-color: ${color};`;
  }

  return attrs;
};

export const tableBackgroundColorPalette = new Map<string, string>();
export const tableBackgroundColorNames = new Map<string, string>();
[
  // [akColorN800, default],
  [akColorB50, 'Blue'],
  [akColorT50, 'Teal'],
  [akColorR50, 'Red'],
  [akColorN30, 'Grey'],
  [akColorP50, 'Purple'],
  [akColorG50, 'Green'],
  [akColorY50, 'Yellow'],
  ['', 'White'],
].forEach(([color, label]) => {
  tableBackgroundColorPalette.set(color.toLowerCase(), label);
  tableBackgroundColorNames.set(label.toLowerCase(), color.toLowerCase());
});

/**
 * @name table_node
 */
export interface Table {
  type: 'table';
  attrs?: {
    isNumberColumnEnabled?: boolean;
  };
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
  colspan?: number;
  rowspan?: number;
  colwidth?: number[];
  background?: string;
}

// "any", because NodeSpec doesn't support "tableRole" yet
export const table: any = {
  content: 'tableRow+',
  attrs: {
    isNumberColumnEnabled: { default: false },
  },
  tableRole: 'table',
  isolating: true,
  group: 'block',
  parseDOM: [
    {
      tag: 'table',
      getAttrs: (dom: Element) => ({
        isNumberColumnEnabled:
          dom.getAttribute('data-number-column') === 'true' ? true : false,
      }),
    },
  ],
  toDOM(node) {
    const attrs = {
      'data-number-column': node.attrs.isNumberColumnEnabled,
    };
    return ['table', attrs, ['tbody', 0]];
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
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock |  mediaGroup | mediaSingle | applicationCard | decisionList | taskList | extension)+',
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

export const toJSONTableCell = (node: PmNode) => ({
  attrs: Object.keys(node.attrs).reduce((obj, key) => {
    if (cellAttrs[key].default !== node.attrs[key]) {
      obj[key] = node.attrs[key];
    }

    return obj;
  }, {}),
});

export const tableHeader: any = {
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle  | applicationCard | decisionList | taskList | extension)+',
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

export const toJSONTableHeader = toJSONTableCell;
