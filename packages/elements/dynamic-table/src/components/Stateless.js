// @flow
import React, {
  Component,
  type Component as ComponentType,
  type Element as ReactElement,
  type Node,
} from 'react';
import { PaginationStateless } from '@atlaskit/pagination';

import { ASC, DESC, SMALL, LARGE } from '../internal/constants';
import { getPageRows } from '../internal/helpers';
import TableHead from './TableHead';
import Body from './Body';
import LoadingContainer from './LoadingContainer';
import LoadingContainerAdvanced from './LoadingContainerAdvanced';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/EmptyBody';

import { Table, Caption } from '../styled/DynamicTable';

import type {
  HeadType,
  RowType,
  RowCellType,
  SortOrderType,
  LoadingSpinnerSizeType,
} from '../types';

function toggleSortOrder(currentSortOrder) {
  switch (currentSortOrder) {
    case DESC:
      return ASC;
    case ASC:
      return DESC;
    default:
      return currentSortOrder;
  }
}

type Props = {
  caption?: Node,
  head?: HeadType,
  rows?: Array<RowType>,
  emptyView?: ReactElement<any>,
  loadingSpinnerSize?: LoadingSpinnerSizeType,
  isLoading?: boolean,
  isFixedSize?: boolean,
  rowsPerPage?: number,
  onSetPage: Function,
  onSort: Function,
  page?: number,
  sortKey?: string,
  sortOrder?: SortOrderType,
};

export default class DynamicTable extends Component<Props, {}> {
  tableBody: ComponentType<any, {}> | null;
  static defaultProps = {
    isLoading: false,
    isFixedSize: false,
    rowsPerPage: Infinity,
    onSetPage() {},
    onSort() {},
    page: 1,
  };

  onSort = (item: RowCellType) => () => {
    const { sortKey, sortOrder, onSort } = this.props;
    const { key } = item;
    if (!key) return;
    const sortOrderFormatted =
      key !== sortKey ? ASC : toggleSortOrder(sortOrder);
    this.onSetPage(1);
    onSort({ key, item, sortOrder: sortOrderFormatted });
  };

  onSetPage = (page?: number) => this.props.onSetPage(page);

  getSpinnerSize = () => {
    const { page, rows, rowsPerPage, loadingSpinnerSize } = this.props;

    if (loadingSpinnerSize) {
      return loadingSpinnerSize;
    }

    return getPageRows(page, rows || [], rowsPerPage).length > 2
      ? LARGE
      : SMALL;
  };

  renderEmptyBody = () => {
    const { emptyView, isLoading } = this.props;

    if (isLoading) {
      return <EmptyViewWithFixedHeight />;
    }

    return emptyView && <EmptyViewContainer>{emptyView}</EmptyViewContainer>;
  };

  render() {
    const {
      caption,
      head,
      isFixedSize,
      page,
      rows,
      rowsPerPage,
      sortKey,
      sortOrder,
      isLoading,
    } = this.props;

    const rowsLength = rows && rows.length;
    const bodyProps = {
      rows,
      head,
      sortKey,
      sortOrder,
      rowsPerPage,
      page,
      isFixedSize,
    };
    const totalPages =
      rowsLength && rowsPerPage ? Math.ceil(rowsLength / rowsPerPage) : 0;
    const rowsExist = !!rowsLength;

    const spinnerSize = this.getSpinnerSize();
    const emptyBody = this.renderEmptyBody();

    return (
      <div>
        <LoadingContainerAdvanced
          isLoading={isLoading && rowsExist}
          spinnerSize={spinnerSize}
          targetRef={() => this.tableBody}
        >
          <Table isFixedSize={isFixedSize}>
            {!!caption && <Caption>{caption}</Caption>}
            {head && (
              <TableHead
                head={head}
                onSort={this.onSort}
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
            )}
            {rowsExist && (
              <Body
                {...bodyProps}
                ref={el => {
                  this.tableBody = el;
                }}
              />
            )}
          </Table>
        </LoadingContainerAdvanced>
        {!totalPages ? null : (
          <PaginationStateless
            current={page}
            onSetPage={this.onSetPage}
            total={totalPages}
          />
        )}
        {!rowsExist &&
          emptyBody && (
            <LoadingContainer isLoading={isLoading} spinnerSize={LARGE}>
              {emptyBody}
            </LoadingContainer>
          )}
      </div>
    );
  }
}
