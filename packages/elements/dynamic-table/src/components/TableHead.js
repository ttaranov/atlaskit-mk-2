// @flow
import React from 'react';
import { ASC, DESC } from '../internal/constants';
import { Head, HeadCell } from '../styled/TableHead';
import type { HeadType } from '../types';

type Props = {
  head: HeadType,
  sortKey: ?string,
  sortOrder?: ASC | DESC,
  isFixedSize?: boolean,
  onSort: Function,
};

const TableHead = ({
  head,
  sortKey,
  sortOrder,
  isFixedSize,
  onSort,
}: Props) => {
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
};

export default TableHead;
