// @flow
import React, { Component } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import DynamicTableStateless from './Stateless';
import type { SortOrderType, StatelessProps, RankEnd, RowType } from '../types';
import { reorderRows } from '../internal/helpers';

type Props = {
  defaultPage: number,
  defaultSortKey?: string,
  defaultSortOrder?: SortOrderType,
} & StatelessProps;

type State = {
  page: number,
  sortKey?: string,
  sortOrder?: 'ASC' | 'DESC',
  rows?: RowType[],
};

export default class DynamicTable extends Component<Props, State> {
  static defaultProps = {
    defaultPage: 1,
    isLoading: false,
    isFixedSize: false,
    isRankable: false,
    onSetPage() {},
    onSort() {},
    rowsPerPage: Infinity,
  };

  state = {
    page: this.props.defaultPage,
    sortKey: this.props.defaultSortKey,
    sortOrder: this.props.defaultSortOrder,
    rows: this.props.rows,
  };

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      page: newProps.page,
      sortKey: newProps.defaultSortKey,
      sortOrder: newProps.defaultSortOrder,
      rows: newProps.rows,
    });
  }

  onSetPage = (page: number, event: ?UIAnalyticsEvent) => {
    this.props.onSetPage(page, event);
    this.setState({ page });
  };

  onSort = ({ key, item, sortOrder }: Object) => {
    this.props.onSort({ key, item, sortOrder });
    this.setState({ sortKey: key, sortOrder, page: 1 });
  };

  onRankEndIfExists = (params: RankEnd) => {
    if (this.props.onRankEnd) {
      this.props.onRankEnd(params);
    }
  };

  onRankEnd = (params: RankEnd) => {
    const { destination } = params;
    const { rows, page } = this.state;
    const { rowsPerPage } = this.props;

    if (!destination || !rows) {
      this.onRankEndIfExists(params);
      return;
    }

    const reordered = reorderRows(params, rows, page, rowsPerPage);

    this.setState({
      rows: reordered,
    });

    this.onRankEndIfExists(params);
  };

  render() {
    const { page, sortKey, sortOrder, rows } = this.state;
    const {
      caption,
      emptyView,
      head,
      loadingSpinnerSize,
      isLoading,
      isFixedSize,
      isRankable,
      isRankingDisabled,
      rowsPerPage,
      paginationi18n,
      onRankStart,
    } = this.props;

    return (
      <DynamicTableStateless
        paginationi18n={paginationi18n}
        caption={caption}
        emptyView={emptyView}
        head={head}
        loadingSpinnerSize={loadingSpinnerSize}
        isLoading={isLoading}
        isFixedSize={isFixedSize}
        onSetPage={this.onSetPage}
        onSort={this.onSort}
        page={page}
        rows={rows}
        rowsPerPage={rowsPerPage}
        sortKey={sortKey}
        sortOrder={sortOrder}
        isRankable={isRankable}
        isRankingDisabled={isRankingDisabled}
        onRankEnd={this.onRankEnd}
        onRankStart={onRankStart}
      />
    );
  }
}
