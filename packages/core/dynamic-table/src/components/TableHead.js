// @flow
import React, { Component } from 'react';
import { Head } from '../styled/TableHead';
import { validateSortKey } from '../internal/helpers';
import type { HeadType, SortOrderType } from '../types';
import HeadCell from './TableHeadCell';
import RankableHeadCell from './rankable/TableHeadCell';

type Props = {
  head: HeadType,
  sortKey: ?string,
  sortOrder?: SortOrderType,
  isFixedSize?: boolean,
  onSort: Function,
  isRankable?: boolean,
  isRanking: boolean,
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
    const {
      head,
      sortKey,
      sortOrder,
      isFixedSize,
      onSort,
      isRanking,
      isRankable,
    } = this.props;

    if (!head) return null;

    const HeadCellComponent = isRankable ? RankableHeadCell : HeadCell;

    const { cells, ...rest } = head;

    return (
      <Head {...rest} isRanking={isRanking}>
        <tr>
          {cells.map((cell, index) => {
            const { isSortable, key, ...restCellProps } = cell;

            return (
              <HeadCellComponent
                isFixedSize={isFixedSize}
                isSortable={!!isSortable}
                isRanking={isRanking}
                key={key || index}
                onClick={isSortable ? onSort(cell) : undefined}
                sortOrder={key === sortKey ? sortOrder : undefined}
                {...restCellProps}
              />
            );
          })}
        </tr>
      </Head>
    );
  }
}

export default TableHead;
