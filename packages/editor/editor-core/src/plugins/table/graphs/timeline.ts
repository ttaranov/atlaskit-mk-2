import { Node } from 'prosemirror-model';
import { containsHeaderRow, containsHeaderColumn } from '../utils';
import { EditorState } from 'prosemirror-state';
import { GraphTransformer, TimelineDataset, TimelineEntry } from './types';

class TimelineTransformer implements GraphTransformer {
  private node: Node;
  private state: EditorState;

  private dataSourceColumns = [1, 2];

  constructor(state, node) {
    this.state = state;
    this.node = node;
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
          start: new Date(
            Number(
              row.child(this.dataSourceColumns[0]).firstChild!.firstChild!.attrs
                .timestamp,
            ),
          ),
          end: new Date(
            Number(
              row.child(this.dataSourceColumns[1]).firstChild!.firstChild!.attrs
                .timestamp,
            ),
          ),
        });
      }
    });

    console.log('entries', entries);

    return {
      entries,
    };
  }

  fromChart(obj) {
    return this.node;
  }
}

export { TimelineTransformer };
