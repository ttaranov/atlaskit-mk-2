import * as React from 'react';
import {
  calcTableWidth,
  WidthConsumer,
  TableSharedCssClassName,
} from '@atlaskit/editor-common';

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
    <WidthConsumer>
      {({ width }) => (
        <div
          className={TableSharedCssClassName.TABLE_CONTAINER}
          data-layout={props.layout}
          style={{ width: calcTableWidth(props.layout, width, false) }}
        >
          <table data-number-column={props.isNumberColumnEnabled}>
            {colgroup}
            <tbody>{props.children}</tbody>
          </table>
        </div>
      )}
    </WidthConsumer>
  );
};

export default Table;
