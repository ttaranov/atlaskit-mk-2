import { Node as PMNode, Schema } from 'prosemirror-model';
import { Builder, AddArgs } from './builder';

export type CellType = 'tableHeader' | 'tableCell';

export interface TableCell {
  type: CellType;
  content: PMNode[];
}

export interface TableRow {
  cells: TableCell[];
}

export interface Table {
  rows: TableRow[];
}

export interface AddCellArgs extends AddArgs {
  style: '|' | '||' | null;
  content: PMNode[];
}

export default class TableBuilder implements Builder {
  private schema: Schema;
  private root: Table;
  private lastCell: TableCell;
  private lastRow: TableRow;

  constructor(schema: Schema) {
    this.schema = schema;
    this.root = {
      rows: [],
    };
  }

  /**
   * Return the cell type based on the delimeter
   * @param {string} style
   * @returns {CellType}
   */
  static getType(style: string): CellType {
    return /\|\|/.test(style) ? 'tableHeader' : 'tableCell';
  }

  /**
   * Add new cells to the table
   * @param {AddCellArgs[]} cells
   */
  add(cells: AddCellArgs[]) {
    // Iterate the cells and create TH/TD based on the delimeter
    let index = 0;
    for (const cell of cells) {
      const { style, content } = cell;

      // For the first item, determine if it's a new row or not
      if (index++ === 0) {
        if (style === null) {
          // If there's no style (cell delimeter), it's part of the previous row
          const hardBreak = this.schema.nodes.hardBreak.create();
          this.lastCell.content.push(hardBreak, ...content);
          continue;
        } else {
          // Otherwise, create a new row
          this.addRow();
        }
      }

      const type = TableBuilder.getType(style!);
      const newCell = { type, content };
      this.lastCell = newCell;
      this.lastRow.cells.push(newCell);
    }
  }

  /**
   * Build a prosemirror table from the data
   * @returns {PMNode}
   */
  buildPMNode(): PMNode {
    return this.buildTableNode();
  }

  /**
   * Build prosemirror table node
   * @returns {PMNode}
   */
  private buildTableNode = (): PMNode => {
    const { root } = this;
    const { table } = this.schema.nodes;
    return table.create({}, root.rows.map(this.buildTableRowNode));
  };

  /**
   * Build prosemirror tr node
   * @returns {PMNode}
   */
  private buildTableRowNode = (row: TableRow): PMNode => {
    const { tableRow } = this.schema.nodes;
    return tableRow.create({}, row.cells.map(this.buildTableCellNode));
  };

  /**
   * Build prosemirror td/th node
   * @param {TableCell} cell
   * @returns {PMNode}
   */
  private buildTableCellNode = (cell: TableCell): PMNode => {
    const { type, content } = cell;
    const cellNode = this.schema.nodes[type];
    return cellNode.create({}, content);
  };

  /**
   * Add a new row to the table
   */
  private addRow() {
    const { rows } = this.root;
    const row: TableRow = {
      cells: [],
    };

    rows.push(row);

    this.lastRow = row;
  }
}
