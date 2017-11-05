import { NodeSpec } from 'prosemirror-model';
import { tableNodes } from 'prosemirror-tables';
import { TableCellContent } from './doc';

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
  background?: string;
}

// TS doesn't generate type if we destructure here
const nodes = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom) {
        return (dom as HTMLElement).style.backgroundColor || null;
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `backgroundcolor: ${value};`;
        }
      }
    }
  }
});

const table: NodeSpec = {...nodes.table, content: 'tableRow+'};
const tableCell: NodeSpec = nodes.table_cell;
const tableHeader: NodeSpec = nodes.table_header;
const tableRow: NodeSpec = {...nodes.table_row, content: '(tableCell | tableHeader)*'};

export {
  table,
  tableCell,
  tableHeader,
  tableRow
};
