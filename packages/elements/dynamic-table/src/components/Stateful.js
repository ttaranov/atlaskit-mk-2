// @flow
import React, { Component } from 'react';
import DynamicTableStateless from './Stateless';
import { ASC, DESC } from '../internal/constants';

// We are disabling prop validation, as the rest of the props passed in are
// handled by validation of the stateless verion.
/* eslint-disable react/prop-types */

type Props = {
  defaultPage?: number,
  defaultSortKey?: string,
  defaultSortOrder?: ASC | DESC,
} & Object;

type State = {
  page: number,
  sortKey?: string,
  sortOrder?: 'ASC' | 'DESC',
};

export default class DynamicTable extends Component<Props, State> {
  static defaultProps = {
    defaultPage: 1,
    isLoading: false,
    isFixedSize: false,
    onSetPage() {},
    onSort() {},
    rowsPerPage: Infinity,
  };

  state = {
    page: this.props.defaultPage,
    sortKey: this.props.defaultSortKey,
    sortOrder: this.props.defaultSortOrder,
  };

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      // $FlowFixMe
      page: newProps.page,
      sortKey: newProps.defaultSortKey,
      sortOrder: newProps.defaultSortOrder,
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

  render() {
    const { page, sortKey, sortOrder } = this.state;
    const {
      caption,
      emptyView,
      head,
      loadingSpinnerSize,
      isLoading,
      isFixedSize,
      rows,
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
      />
    );
  }
}
