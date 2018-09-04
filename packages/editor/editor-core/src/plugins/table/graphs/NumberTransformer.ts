import { containsHeaderRow, containsHeaderColumn } from '../utils';
import { EditorState } from 'prosemirror-state';
import { Schema, Node as PMNode } from 'prosemirror-model';
import {
  GraphTransformer,
  NumberChartDataset,
  NumberChartEntry,
} from './types';

export default class NumberTransformer implements GraphTransformer {
  private node: PMNode;
  private state: EditorState;

  private dataSourceColumns: number[] = [];

  constructor(state, node, settings: any) {
    this.state = state;
    this.node = node;
    this.dataSourceColumns = [settings.values];
  }

  toChart(): NumberChartDataset {
    const legend: string[] = [];
    const entries: NumberChartEntry[] = [];

    const haveHeaderRow = containsHeaderRow(this.state, this.node);
    const haveHeaderColumn = containsHeaderColumn(this.state, this.node);

    this.node.forEach((row, _, rowIdx) => {
      const displayRowNumber = haveHeaderRow ? rowIdx : rowIdx + 1;

      if (rowIdx === this.node.childCount - 1) {
        return;
      }

      if (haveHeaderRow && rowIdx === 0) {
        // take titles from each column if we have heading row
        row.forEach((col, _, colIdx) => {
          legend.push(col.textContent);
        });
      } else {
        // otherwise, it's just data
        // let title = `Row ${displayRowNumber}`;

        // if (haveHeaderColumn) {
        // take the title from the first column
        let title = row.child(0).textContent;
        // }

        entries.push({
          title,
          values: this.dataSourceColumns.map(dataColumnIdx =>
            Number(row.child(dataColumnIdx).textContent),
          ),
        });
      }
    });

    return {
      legend,
      entries,
    };
  }

  fromChart(data: NumberChartDataset, schema: Schema) {
    return this.node;
  }
}
