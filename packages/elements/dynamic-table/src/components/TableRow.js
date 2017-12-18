// @flow
import PropTypes from 'prop-types';
import React from 'react';
import { TableBodyRow, TableBodyCell } from '../styled/TableRow';
import props from '../internal/props';

const Row = ({ row, head, isFixedSize }) => {
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
            key={cellIndex}
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

Row.propTypes = {
  head: props.head,
  isFixedSize: PropTypes.bool,
  row: props.row,
};

export default Row;
