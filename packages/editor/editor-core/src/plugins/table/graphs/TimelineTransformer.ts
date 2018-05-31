import { containsHeaderRow } from '../utils';
import { EditorState } from 'prosemirror-state';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { GraphTransformer, TimelineDataset, TimelineEntry } from './types';

export default class TimelineTransformer implements GraphTransformer {
  private node: PMNode;
  private state: EditorState;

  private dataSourceColumns: number[] = [];

  constructor(state, node, settings) {
    this.state = state;
    this.node = node;
    this.dataSourceColumns = [settings.start, settings.end];
  }

  toChart(): TimelineDataset {
    if (this.dataSourceColumns.length !== 2) {
      console.error('data source column length incorrect');
      return { entries: [] };
    }

    const entries: TimelineEntry[] = [];

    const haveHeaderRow = containsHeaderRow(this.state, this.node);

    this.node.forEach((row, _, rowIdx) => {
      if (haveHeaderRow && rowIdx === 0) {
        // skip header row
        return;
      } else {
        // take the title from the first column
        const title = row.child(0).textContent;

        entries.push({
          title,
          start: Number(
            row.child(this.dataSourceColumns[0]).firstChild!.firstChild!.attrs
              .timestamp,
          ),
          end:
            row.child(this.dataSourceColumns[1]).firstChild &&
            row.child(this.dataSourceColumns[1]).firstChild!.firstChild
              ? Number(
                  row.child(this.dataSourceColumns[1]).firstChild!.firstChild!
                    .attrs.timestamp,
                )
              : null,
        });
      }
    });

    return {
      entries,
    };
  }

  // creates a new table node based on new timeline dataSet
  fromChart(data: TimelineDataset, schema: Schema) {
    const rows: PMNode[] = [];
    const { table, tableCell, tableRow, paragraph, date } = schema.nodes;
    const haveHeaderRow = containsHeaderRow(this.state, this.node);

    for (let rowIndex = 0; rowIndex < this.node.childCount; rowIndex++) {
      const row = this.node.child(rowIndex);
      const cells: PMNode[] = [];

      for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
        const cell = row.child(colIndex);

        if (
          cell.type === tableCell &&
          this.dataSourceColumns.indexOf(colIndex) > -1
        ) {
          const entryType =
            this.dataSourceColumns[0] === colIndex ? 'start' : 'end';
          const timestamp =
            data.entries[haveHeaderRow ? rowIndex - 1 : rowIndex][entryType];
          if (timestamp) {
            const dateNode = date.createChecked({
              timestamp: Math.round(timestamp),
            });

            cells.push(
              tableCell.createChecked(
                cell.attrs,
                paragraph.createChecked({}, dateNode),
              ),
            );
          } else {
            cells.push(cell);
          }
        } else {
          cells.push(cell);
        }
      }
      rows.push(tableRow.createChecked({}, cells));
    }
    this.node = table.createChecked(this.node.attrs, rows);

    return this.node;
  }
}
