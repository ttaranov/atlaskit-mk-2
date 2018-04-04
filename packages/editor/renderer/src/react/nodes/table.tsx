import * as React from 'react';
import { StyledTable } from '@atlaskit/editor-common';

// tslint:disable-next-line:variable-name
const Table = props => {
  const colgroup = props.columnWidths ? (
    <colgroup>
      {props.columnWidths.map((colWidth, idx) => {
        return <col key={idx} style={{ width: `${colWidth}px` }} />;
      })}
    </colgroup>
  ) : null;

  return (
    <StyledTable>
      {colgroup}
      <tbody>{props.children}</tbody>
    </StyledTable>
  );
};

export default Table;
