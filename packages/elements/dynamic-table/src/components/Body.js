// @flow
import React, { Component } from 'react';
import { ASC, DESC } from '../internal/constants';
import { getPageRows } from '../internal/helpers';
import TableRow from './TableRow';
import type { HeadType, RowType } from '../types';

const getSortedRows = (head, rows, sortKey, sortOrder) => {
  if (!sortKey || !head) return rows;
  if (!rows) return [];

  const getSortingCellValue = cells =>
    cells.reduce(
      (result, cell, index) =>
        result ||
        (head &&
          head.cells[index].key === sortKey &&
          (cell.key !== undefined ? cell.key : cell.content)),
      null,
    );

  return rows.sort((a, b) => {
    const valA = getSortingCellValue(a.cells);
    const valB = getSortingCellValue(b.cells);

    const modifier = sortOrder === ASC ? 1 : -1;
    // $FlowFixMe
    if (!valA || valA < valB) return -modifier;
    // $FlowFixMe
    if (!valB || valA > valB) return modifier;
    return 0;
  });
};

type Props = {
  head: HeadType | null,
  isFixedSize: boolean,
  page: number,
  rows: Array<RowType> | null,
  rowsPerPage?: number,
  sortKey?: null | string,
  sortOrder: ASC | DESC,
};

export default class Body extends Component<Props, {}> {
  render() {
    const {
      rows,
      head,
      sortKey,
      sortOrder,
      rowsPerPage,
      page,
      isFixedSize,
    } = this.props;

    const sortedRows = getSortedRows(head, rows, sortKey, sortOrder) || [];
    const pageRows = getPageRows(page, sortedRows, rowsPerPage);

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
