import { contentWidth } from './contentWidth';
import {
  forEachCellInColumn,
  unitToNumber,
  addContainerLeftRightPadding,
} from './utils';

export default class Column {
  width: number;
  wrapWidth: number;
  minWidth: number;

  constructor(width, wrapWidth, minWidth) {
    this.width = width;
    this.wrapWidth = wrapWidth;
    this.minWidth = minWidth;

    return Object.freeze(this);
  }

  get freeSpace() {
    return Math.max(this.width - Math.max(this.wrapWidth, this.minWidth), 0);
  }

  /**
   * Creates a new ResizeState based on the current
   * appearance of an element.
   * @param {HTMLElement} table Reference to the <table> node
   * @param {number} colIdx The column index
   * @param {number} minWidth Minimum width a column is permitted to be
   */
  static fromDOM(table: HTMLElement, colIdx: number, minWidth: number) {
    let minColWidth = minWidth;
    const width = forEachCellInColumn(table, colIdx, (_col, computedStyle) =>
      unitToNumber(computedStyle.width),
    );
    const wrapWidth = forEachCellInColumn(
      table,
      colIdx,
      (col, computedStyle) => {
        const borderWidth = computedStyle
          .borderWidth!.split(' ')
          .reduce((acc, current) => (acc += unitToNumber(current)), 0);

        const { width, minWidth } = contentWidth(col, col);

        // Override the min width, if their is content that can't collapse
        // Past a certain width.
        minColWidth = Math.max(
          addContainerLeftRightPadding(minWidth, computedStyle),
          minColWidth,
        );

        return addContainerLeftRightPadding(width + borderWidth, computedStyle);
      },
    );

    return new Column(width, wrapWidth, minColWidth);
  }
}
