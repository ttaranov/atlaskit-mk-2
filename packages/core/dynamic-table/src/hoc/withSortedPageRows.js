// @flow
import React, { Component, type ComponentType } from 'react';
import { ASC } from '../internal/constants';
import { getPageRows, validateSortKey } from '../internal/helpers';
import type { HeadType, RowType, SortOrderType } from '../types';

// sort all rows based on sort key and order
const getSortedRows = (head, rows, sortKey, sortOrder) => {
  if (!sortKey || !head) return rows;
  if (!rows) return [];

  // return value which will be used for sorting
  const getSortingCellValue = cells =>
    cells.reduce(
      (result, cell, index) =>
        result ||
        (head &&
          head.cells[index].key === sortKey &&
          (cell.key !== undefined ? cell.key : cell.content)),
      null,
    );

  // reorder rows in table based on sorting cell value
  return rows.slice().sort((a, b) => {
    const valA = getSortingCellValue(a.cells);
    const valB = getSortingCellValue(b.cells);

    // modifier used for sorting type (ascending or descending)
    const modifier = sortOrder === ASC ? 1 : -1;
    if (!valA || valA < valB) return -modifier;
    if (!valB || valA > valB) return modifier;
    return 0;
  });
};

type Props = {
  head: HeadType | void,
  page: number | void,
  rows: Array<RowType> | void,
  rowsPerPage?: number,
  sortKey?: void | string,
  sortOrder: SortOrderType | void,
};

export type WithSortedPageRowsProps = {
  pageRows: RowType[],
};

// get one page of data in table, sorting all rows previously
export default function withSortedPageRows(
  WrappedComponent: ComponentType<any>,
) {
  return class WithSortedPageRows extends Component<any> {
    componentWillMount() {
      validateSortKey(this.props.sortKey, this.props.head);
    }
    componentWillReceiveProps(nextProps: Props) {
      if (
        this.props.sortKey !== nextProps.sortKey ||
        this.props.head !== nextProps.head
      ) {
        validateSortKey(nextProps.sortKey, nextProps.head);
      }
    }

    render() {
      const {
        rows,
        head,
        sortKey,
        sortOrder,
        rowsPerPage,
        page,
        ...restProps
      } = this.props;

      const sortedRows = getSortedRows(head, rows, sortKey, sortOrder) || [];
      const pageRows = getPageRows(page, sortedRows, rowsPerPage);

      return (
        <WrappedComponent pageRows={pageRows} head={head} {...restProps} />
      );
    }
  };
}
