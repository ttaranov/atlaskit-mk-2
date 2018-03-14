// @flow
import React, { Component } from 'react';
import TableRow from './TableRow';
import withSortedPageRows, {
  type WithSortedPageRowsProps,
} from '../hoc/withSortedPageRows';
import type { HeadType } from '../types';

type Props = WithSortedPageRowsProps & {
  head: HeadType | void,
  isFixedSize: boolean,
};

class Body extends Component<Props, {}> {
  render() {
    const { pageRows, head, isFixedSize } = this.props;

    return (
      <tbody>
        {pageRows.map((row, rowIndex) => (
          <TableRow
            head={head}
            isFixedSize={isFixedSize}
            key={rowIndex} // eslint-disable-line react/no-array-index-key
            row={row}
          />
        ))}
      </tbody>
    );
  }
}

export default withSortedPageRows(Body);
