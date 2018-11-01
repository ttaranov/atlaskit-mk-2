import { Node as PmNode } from 'prosemirror-model';
import { colors } from '@atlaskit/theme';
import { hexToRgba, isHex } from '../../utils';
import {
  akEditorTableCellBackgroundOpacity,
  akEditorTableNumberColumnWidth,
} from '../../styles';
import { TableCellContent } from './doc';

const {
  N20,
  B50,
  T50,
  P50,
  R50,
  G50,
  Y50,
  N0,
  B75,
  G75,
  R75,
  N40,
  P75,
  T75,
  Y75,
} = colors;

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

export const setCellAttrs = (node: PmNode) => {
  const attrs: {
    colspan?: number;
    rowspan?: number;
    style?: string;
  } = {};
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
    const nodeType = node.type.name;

    // to ensure that we don't overwrite product's style:
    // - it clears background color for <th> if its set to gray
    // - it clears background color for <td> if its set to white
    const ignored =
      (nodeType === 'tableHeader' &&
        background === tableBackgroundColorNames.get('gray')) ||
      (nodeType === 'tableCell' &&
        background === tableBackgroundColorNames.get('white'));

    if (!ignored) {
      const color =
        nodeType === 'tableCell' && isHex(background)
          ? hexToRgba(background, akEditorTableCellBackgroundOpacity)
          : background;

      attrs.style = `${attrs.style || ''}background-color: ${color};`;
    }
  }

  return attrs;
};

export const tableBackgroundColorPalette = new Map<string, string>();

/** New borders for colors in the color picker */
export const tableBackgroundBorderColors = {
  blue: B75,
  teal: T75,
  red: R75,
  gray: N40,
  purple: P75,
  green: G75,
  yellow: Y75,
  white: N40,
};

export const tableBackgroundColorNames = new Map<string, string>();
[
  [B50, 'Blue'],
  [T50, 'Teal'],
  [R50, 'Red'],
  [N20, 'Gray'],
  [P50, 'Purple'],
  [G50, 'Green'],
  [Y50, 'Yellow'],
  [N0, 'White'],
].forEach(([colorValue, colorName]) => {
  tableBackgroundColorPalette.set(colorValue.toLowerCase(), colorName);
  tableBackgroundColorNames.set(
    colorName.toLowerCase(),
    colorValue.toLowerCase(),
  );
});

export function calcTableColumnWidths(node: PmNode): number[] {
  let tableColumnWidths = [];
  const { isNumberColumnEnabled } = node.attrs;

  node.forEach((rowNode, _, i) => {
    rowNode.forEach((colNode, _, j) => {
      let colwidth = colNode.attrs.colwidth || [0];

      if (isNumberColumnEnabled && j === 0) {
        if (!colwidth) {
          colwidth = [akEditorTableNumberColumnWidth];
        }
      }

      // if we have a colwidth attr for this cell, and it contains new
      // colwidths we haven't seen for the whole table yet, add those
      // (colwidths over the table are defined as-we-go)
      if (colwidth && colwidth.length + j > tableColumnWidths.length) {
        tableColumnWidths = tableColumnWidths.slice(0, j).concat(colwidth);
      }
    });
  });

  return tableColumnWidths;
}

export type Layout = 'default' | 'full-width' | 'wide';

export interface TableAttributes {
  isNumberColumnEnabled?: boolean;
  layout?: Layout;
  __autoSize?: boolean;
}

/**
 * @name table_node
 */
export interface TableDefinition {
  type: 'table';
  attrs?: TableAttributes;
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
  attrs?: CellAttributes;
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
  attrs?: CellAttributes;
  content: TableCellContent;
}

export interface CellAttributes {
  colspan?: number;
  rowspan?: number;
  colwidth?: number[];
  background?: string;
}

// TODO: Fix any, potential issue. ED-5048
export const table: any = {
  content: 'tableRow+',
  attrs: {
    isNumberColumnEnabled: { default: false },
    layout: { default: 'default' },
    __autoSize: { default: false },
  },
  tableRole: 'table',
  isolating: true,
  selectable: false,
  group: 'block',
  parseDOM: [
    {
      tag: 'table',
      getAttrs: (dom: Element) => ({
        isNumberColumnEnabled:
          dom.getAttribute('data-number-column') === 'true' ? true : false,
        layout: dom.getAttribute('data-layout') || 'default',
        __autoSize: dom.getAttribute('data-autosize') === 'true' ? true : false,
      }),
    },
  ],
  toDOM(node) {
    const attrs = {
      'data-number-column': node.attrs.isNumberColumnEnabled,
      'data-layout': node.attrs.layout,
      'data-autosize': node.attrs.__autoSize,
    };
    return ['table', attrs, ['tbody', 0]];
  },
};

export const tableToJSON = (node: PmNode) => ({
  attrs: Object.keys(node.attrs)
    .filter(key => !key.startsWith('__'))
    .reduce((obj, key) => {
      obj[key] = node.attrs[key];
      return obj;
    }, {}),
});

export const tableRow = {
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

export const tableCell = {
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock |  mediaGroup | mediaSingle | applicationCard | decisionList | taskList | blockCard | extension)+',
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

export const tableHeader = {
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle  | applicationCard | decisionList | taskList | blockCard | extension)+',
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
