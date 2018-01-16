// @flow
import React, { Component } from 'react';
import DynamicTableStateless from './Stateless';
import type { SortOrderType, StatelessProps, RankEnd, RankEndLocation, RowType } from '../types';

// We are disabling prop validation, as the rest of the props passed in are
// handled by validation of the stateless verion.
/* eslint-disable react/prop-types */

type Props = {
  defaultPage: number,
  defaultSortKey?: string,
  defaultSortOrder?: SortOrderType,
} & StatelessProps;

type State = {
  page: number,
  sortKey?: string,
  sortOrder?: 'ASC' | 'DESC',
  rows: RowType[],
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
      // $FlowFixMe
      page: newProps.page,
      sortKey: newProps.defaultSortKey,
      sortOrder: newProps.defaultSortOrder,
      rows: newProps.rows,
    });
  }

  onSetPage = (page: number) => {
    this.props.onSetPage(page);
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
  }

  computeRankEndIndex = (rankEndLocation: RankEndLocation) => {
    const { afterKey } = rankEndLocation;
    const { rowsPerPage } = this.props;

    if (!afterKey) {
      // beginning of current page
      return rowsPerPage ? (this.state.page - 1) * rowsPerPage : 0;
    }

    return this.state.rows.findIndex((row) => row.key === afterKey);
  }

  onRankEnd = (params: RankEnd) => {
    const { destination, sourceKey } = params;

    if (!destination) {
      this.onRankEndIfExists(params);
      return;
    }

    const { rows } = this.state;
    const fromIndex = rows.findIndex(({key}) => key === sourceKey);
    const toIndex = this.computeRankEndIndex(destination);

    const result = rows.slice();
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    this.setState({
      rows: result
    });

    this.onRankEndIfExists(params);
  }

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
      rowsPerPage,
    } = this.props;

    return (
      <DynamicTableStateless
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
        onRankEnd={this.onRankEnd}
        onRankStart={this.props.onRankStart}
      />
    );
  }
}
