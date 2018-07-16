export type ColumnInfo = {
  width: number;
  span: number;
};

class ColumnWidths {
  private columns: ColumnInfo[];

  constructor() {
    this.columns = [];
  }

  /**
   * Returns an array with individual column widths, with each column spread evenly across
   * the columns it spans.
   */
  get dividedWidths() {
    return this.columns.map(colInfo => colInfo.width / colInfo.span);
  }

  get columnInfo() {
    return this.columns;
  }

  /**
   * Returns an array representing the widths of each (possibly spanned) column within a range.
   * @param colIdx 0-based index for the start column.
   * @param span The number of columns the cell spans.
   * @param autosizeEnd Whether to return 0 for the very last column of the table.
   */
  width(colIdx: number, span: number = 1, autosizeEnd = false): number[] {
    return this.columns
      .slice(colIdx, colIdx + span)
      .map(
        (colInfo, idx) =>
          autosizeEnd && idx + colIdx === this.columns.length - 1
            ? 0
            : colInfo.width,
      );
  }

  visit(colIdx: number, width: number, span: number = 1): void {
    if (this.columns.length && colIdx < this.columns.length) {
      const existingCol = this.columns[colIdx];

      if (span <= existingCol.span) {
        // split the column
        existingCol.span -= span;

        this.columns = this.columns.fill(
          {
            width,
            span,
          },
          colIdx,
          colIdx + span,
        );
      } else if (span === existingCol.span) {
        // same column span, update the width
        existingCol.width = width;
      }
    } else {
      // unseen columns
      this.columns = this.columns.concat(
        Array(this.columns.length + span - colIdx),
      );

      this.columns.fill(
        {
          width,
          span,
        },
        colIdx,
        colIdx + span,
      );
    }
  }
}

function parseDOMColumnWidths(node: HTMLElement): ColumnWidths {
  const tw = new ColumnWidths();

  const rows = node.querySelectorAll('tr');

  for (let i = 0, rowCount = rows.length; i < rowCount; i++) {
    const row = rows[i];
    const cols = row.querySelectorAll('td,th');

    let colPos = 0;

    for (let j = 0, colCount = cols.length; j < colCount; j++) {
      const col = cols[j];

      const cssWidth = getComputedStyle(col).width!;
      let colwidth = cssWidth.endsWith('px')
        ? Number(cssWidth.substring(0, cssWidth.length - 2))
        : 0;
      const colspan = col.hasAttribute('colspan')
        ? Number(col.getAttribute('colspan'))
        : 1;

      tw.visit(colPos, colwidth, colspan);

      colPos += colspan;
    }
  }

  return tw;
}

export { ColumnWidths, parseDOMColumnWidths };
