// @flow
import React, { Component, type ComponentType } from 'react';
import { ASC } from '../internal/constants';
import { getPageRows, validateSortKey } from '../internal/helpers';
import type { HeadType, RowType, SortOrderType } from '../types';

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

  return Array.from(rows).sort((a, b) => {
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

export default function withSortedPageRows<WrappedProps: WithSortedPageRowsProps>(
  WrappedComponent: ComponentType<WrappedProps>,
): ComponentType<$Diff<WrappedProps, WithSortedPageRowsProps>> {
  return class extends Component<any> {
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
