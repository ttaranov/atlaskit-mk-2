import * as React from 'react';
import { calcTableWidth } from '@atlaskit/editor-common';
import { BreakoutConsumer } from '../';

const Table = props => {
  const colgroup = props.columnWidths ? (
    <colgroup>
      {props.columnWidths.map((colWidth, idx) => {
        const style = colWidth ? { width: `${colWidth}px` } : {};
        return <col key={idx} style={style} />;
      })}
    </colgroup>
  ) : null;

  return (
    <BreakoutConsumer>
      {containerWidth => (
        <div
          className="table-container"
          data-layout={props.layout}
          style={{ width: calcTableWidth(props.layout, containerWidth, false) }}
        >
          <table data-number-column={props.isNumberColumnEnabled}>
            {colgroup}
            <tbody>{props.children}</tbody>
          </table>
        </div>
      )}
    </BreakoutConsumer>
  );
};

export default Table;
