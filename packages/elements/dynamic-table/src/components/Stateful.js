// @flow
import React, { Component } from 'react';
import DynamicTableStateless from './Stateless';

// We are disabling prop validation, as the rest of the props passed in are
// handled by validation of the stateless verion.
/* eslint-disable react/prop-types */

type Props = {
  caption: string | null,
  defaultPage?: number,
  defaultSortKey?: string | null,
  defaultSortOrder?: 'ASC' | 'DESC' | null,
  emptyView: null,
  head: null,
  loadingSpinnerSize: string | null,
  isFixedSize?: boolean,
  isLoading?: boolean,
  onSort?: Function,
  onSetPage?: Function,
  rows?: null | Array<{}>,
  rowsPerPage?: number,
};

type State = {
  page?: number,
  sortKey?: string | null,
  sortOrder?: 'ASC' | 'DESC' | null,
};
export default class DynamicTable extends Component<Props, State> {
  static defaultProps = {
    caption: null,
    defaultPage: 1,
    defaultSortKey: null,
    defaultSortOrder: null,
    emptyView: null,
    head: null,
    loadingSpinnerSize: null,
    isLoading: false,
    isFixedSize: false,
    onSetPage() {},
    onSort() {},
    rows: null,
    rowsPerPage: Infinity,
  };

  state: State = {
    page: this.props.defaultPage,
    sortKey: this.props.defaultSortKey,
    sortOrder: this.props.defaultSortOrder,
  };

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      page: newProps.page,
      sortKey: newProps.defaultSortKey,
      sortOrder: newProps.defaultSortOrder,
    });
  }

  onSetPage = page => {
    this.props.onSetPage(page);
    this.setState({ page });
  };

  onSort = ({
    key,
    item,
    sortOrder,
  }: {
    key?: string,
    item: ?Object,
    sortOrder: 'ASC' | 'DESC',
  }) => {
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
