// @flow
import React, { Component, type Component as ComponentType } from 'react';
import { PaginationStateless } from '@atlaskit/pagination';

import { ASC, DESC, SMALL, LARGE } from '../internal/constants';
import {
  getPageRows,
  validateSortKey,
  assertIsSortable,
} from '../internal/helpers';
import TableHead from './TableHead';
import Body from './Body';
import RankableBody from './rankable/Body';
import LoadingContainer from './LoadingContainer';
import LoadingContainerAdvanced from './LoadingContainerAdvanced';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/EmptyBody';

import { Table, Caption } from '../styled/DynamicTable';

import type { StatelessProps as Props, RowCellType, RankStart, RankEnd } from '../types';

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

type State = {
  isRanking: boolean,
}

export default class DynamicTable extends Component<Props, State> {
  tableBody: ComponentType<any, any> | null;

  state = {
    isRanking: false,
  }

  static defaultProps = {
    isLoading: false,
    isRankable: false,
    isFixedSize: false,
    rowsPerPage: Infinity,
    onSetPage() {},
    onSort() {},
    page: 1,
    onRankStart: () => {},
    onRankEnd: () => {},
  };
  componentWillMount() {
    validateSortKey(this.props.sortKey, this.props.head);
    assertIsSortable(this.props.head);
  }
  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.sortKey !== nextProps.sortKey ||
      this.props.head !== nextProps.head
    ) {
      validateSortKey(nextProps.sortKey, nextProps.head);
    }
    if (this.props.head !== nextProps.head) {
      assertIsSortable(nextProps.head);
    }
  }
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

  onRankStart = (params: RankStart) => {
    this.setState({
      isRanking: true,
    });

    if (this.props.onRankStart) {
      this.props.onRankStart(params);
    }
  }

  onRankEnd = (params: RankEnd) => {
    this.setState({
      isRanking: false,
    });

    if (this.props.onRankEnd) {
      this.props.onRankEnd(params);
    }
  }

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
      isRankable,
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
      ref: el => {
        this.tableBody = el;
      }
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
            {rowsExist && isRankable ? (
              <RankableBody
                {...bodyProps}
                isRanking={this.state.isRanking}
                onRankStart={this.onRankStart}
                onRankEnd={this.onRankEnd}
              />
            ) : (
              <Body
                {...bodyProps}
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
