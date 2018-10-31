// @flow
import React, { Component, type Component as ComponentType } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Pagination from '@atlaskit/pagination';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { ASC, DESC, SMALL, LARGE } from '../internal/constants';
import {
  getPageRows,
  validateSortKey,
  assertIsSortable,
} from '../internal/helpers';
import TableHead from './TableHead';
import Body from './Body';
import RankableTableBody from './rankable/Body';
import LoadingContainer from './LoadingContainer';
import LoadingContainerAdvanced from './LoadingContainerAdvanced';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../styled/EmptyBody';

import { Table, Caption, PaginationWrapper } from '../styled/DynamicTable';

import type {
  StatelessProps as Props,
  RowCellType,
  RankStart,
  RankEnd,
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

type State = {
  isRanking: boolean,
};

class DynamicTable extends Component<Props, State> {
  tableBody: ?ComponentType<any, any>;

  state = {
    isRanking: false,
  };

  static defaultProps = {
    isLoading: false,
    isFixedSize: false,
    rowsPerPage: Infinity,
    onSetPage() {},
    onSort() {},
    page: 1,
    isRankable: false,
    isRankingDisabled: false,
    onRankStart: () => {},
    onRankEnd: () => {},
    paginationi18n: {
      prev: 'Prev',
      next: 'Next',
    },
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
    const { sortKey, sortOrder, onSort, isRankable } = this.props;
    const { key } = item;
    if (!key) return;
    this.onSetPage(1, undefined);

    if (isRankable && key === sortKey && sortOrder === DESC) {
      onSort({
        key: null,
        sortOrder: null,
        item,
      });

      return;
    }

    const sortOrderFormatted =
      key !== sortKey ? ASC : toggleSortOrder(sortOrder);
    onSort({ key, item, sortOrder: sortOrderFormatted });
  };

  onSetPage = (page: number, event: ?UIAnalyticsEvent) => {
    this.props.onSetPage(page, event);
  };

  onRankStart = (params: RankStart) => {
    this.setState({
      isRanking: true,
    });

    if (this.props.onRankStart) {
      this.props.onRankStart(params);
    }
  };

  onRankEnd = (params: RankEnd) => {
    this.setState({
      isRanking: false,
    });

    if (this.props.onRankEnd) {
      this.props.onRankEnd(params);
    }
  };

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
      isRankable,
      isRankingDisabled,
      paginationi18n,
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
      },
    };
    const totalPages =
      rowsLength && rowsPerPage ? Math.ceil(rowsLength / rowsPerPage) : 0;
    const rowsExist = !!rowsLength;

    const spinnerSize = this.getSpinnerSize();
    const emptyBody = this.renderEmptyBody();
    const canRank = isRankable && !sortKey;

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
                isRanking={this.state.isRanking}
                isRankable={canRank}
              />
            )}
            {rowsExist &&
              (canRank ? (
                <RankableTableBody
                  {...bodyProps}
                  isRanking={this.state.isRanking}
                  onRankStart={this.onRankStart}
                  onRankEnd={this.onRankEnd}
                  isRankingDisabled={isRankingDisabled || isLoading}
                />
              ) : (
                <Body {...bodyProps} />
              ))}
          </Table>
        </LoadingContainerAdvanced>
        {!totalPages ? null : (
          <PaginationWrapper>
            <Pagination
              value={page}
              onChange={this.onSetPage}
              total={totalPages}
              i18n={paginationi18n}
            />
          </PaginationWrapper>
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

export { DynamicTable as DynamicTableWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'dynamicTable',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onSort: createAndFireEventOnAtlaskit({
      action: 'sorted',
      actionSubject: 'dynamicTable',

      attributes: {
        componentName: 'dynamicTable',
        packageName,
        packageVersion,
      },
    }),

    onRankEnd: createAndFireEventOnAtlaskit({
      action: 'ranked',
      actionSubject: 'dynamicTable',

      attributes: {
        componentName: 'dynamicTable',
        packageName,
        packageVersion,
      },
    }),
  })(DynamicTable),
);
