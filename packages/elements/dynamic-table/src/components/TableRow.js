// @flow
import React from 'react';
import { TableBodyRow } from '../styled/TableRow';
import { TableBodyCell } from '../styled/TableCell';
import type { HeadType, RowType } from '../types';

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  row: RowType,
};

const Row = ({ row, head, isFixedSize }: Props) => {
  const { cells, ...restRowProps } = row;

  return (
    <TableBodyRow {...restRowProps}>
      {cells.map((cell, cellIndex) => {
        const { content, ...restCellProps } = cell;
        const { shouldTruncate, width } =
          (head || { cells: [] }).cells[cellIndex] || {};

        return (
          <TableBodyCell
            {...restCellProps}
            isFixedSize={isFixedSize}
            key={cellIndex} // eslint-disable-line react/no-array-index-key
            shouldTruncate={shouldTruncate}
            width={width}
          >
            {content}
          </TableBodyCell>
        );
      })}
    </TableBodyRow>
  );
};

export default Row;
