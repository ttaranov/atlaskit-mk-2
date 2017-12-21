// @flow
import React, { Component } from 'react';
import { Head, HeadCell } from '../styled/TableHead';
import { validateSortKey } from '../internal/helpers';
import type { HeadType, SortOrderType } from '../types';

type Props = {
  head: HeadType,
  sortKey: ?string,
  sortOrder?: SortOrderType,
  isFixedSize?: boolean,
  onSort: Function,
};

class TableHead extends Component<Props, {}> {
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
    const { head, sortKey, sortOrder, isFixedSize, onSort } = this.props;

    if (!head) return null;

    const { cells, ...rest } = head;

    return (
      <Head {...rest}>
        <tr>
          {cells.map((cell, index) => {
            const { isSortable, key, content, ...restCellProps } = cell;

            return (
              <HeadCell
                isFixedSize={isFixedSize}
                isSortable={isSortable}
                key={key || index}
                onClick={isSortable && onSort(cell)}
                sortOrder={key === sortKey && sortOrder}
                {...restCellProps}
              >
                <span>{content}</span>
              </HeadCell>
            );
          })}
        </tr>
      </Head>
    );
  }
}

export default TableHead;
