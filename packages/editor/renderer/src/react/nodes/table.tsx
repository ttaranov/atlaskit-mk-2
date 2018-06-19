import * as React from 'react';
import { calcTableWidth } from '@atlaskit/editor-common';
import { BreakoutConsumer } from '../';
import { ReactElement } from '../../../../editor-core/src/types';

const Table = props => {
  const { isNumberColumnEnabled, columnWidths, children, layout } = props;

  let colgroup;
  if (columnWidths && columnWidths.length > 0) {
    const cols: ReactElement[] = [];
    if (isNumberColumnEnabled) {
      cols.push(<col key={-1} style={{ width: 0 }} />);
    }
    {
      columnWidths.forEach((colWidth, idx) => {
        cols.push(<col key={idx} style={{ width: `${colWidth}px` }} />);
      })
    }
    colgroup = <colgroup>{cols}</colgroup>;
  }

  let tableRows
  if (children && children.length > 0) {
    tableRows = children.map((row, index) => {
      return React.cloneElement(
        row as React.ReactElement<any>,
        { isNumberColumnEnabled: isNumberColumnEnabled, index }
      );
    });
  }
  return (
    <BreakoutConsumer>
      {containerWidth => (
        <div
          className="table-container"
          data-layout={layout}
          style={{
            width: calcTableWidth(layout, containerWidth, false)
          }}
        >
          <table data-number-column={isNumberColumnEnabled}>
            {colgroup}
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )}
    </BreakoutConsumer>
  );
};

export default Table;
