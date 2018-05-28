import { Node } from 'prosemirror-model';
import { containsHeaderRow, containsHeaderColumn } from '../utils';
import { EditorState } from 'prosemirror-state';
import {
  GraphTransformer,
  NumberChartDataset,
  NumberChartEntry,
} from './types';

class NumberTransformer implements GraphTransformer {
  private node: Node;
  private state: EditorState;

  private dataSourceColumns = [1];

  constructor(state, node) {
    this.state = state;
    this.node = node;
  }

  toChart(): NumberChartDataset {
    const legend: string[] = [];
    const entries: NumberChartEntry[] = [];

    const haveHeaderRow = containsHeaderRow(this.state, this.node);
    const haveHeaderColumn = containsHeaderColumn(this.state, this.node);

    this.node.forEach((row, _, rowIdx) => {
      const displayRowNumber = haveHeaderRow ? rowIdx : rowIdx + 1;

      if (haveHeaderRow && rowIdx === 0) {
        // take titles from each column if we have heading row
        row.forEach((col, _, colIdx) => {
          legend.push(col.textContent);
        });
      } else {
        // otherwise, it's just data
        let title = `Row ${displayRowNumber}`;

        if (haveHeaderColumn) {
          // take the title from the first column
          title = row.child(0).textContent;
        }

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

  fromChart(obj) {
    return this.node;
  }
}

export { NumberTransformer };
