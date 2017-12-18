// @flow
import PropTypes from 'prop-types';
import React from 'react';
import { ASC, DESC } from '../internal/constants';
import { Head, HeadCell } from '../styled/TableHead';
import props from '../internal/props';

const TableHead = ({ head, sortKey, sortOrder, isFixedSize, onSort }) => {
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

TableHead.propTypes = {
  head: props.head,
  isFixedSize: PropTypes.bool,
  onSort: PropTypes.func,
  sortKey: props.sortKey,
  sortOrder: PropTypes.oneOf([ASC, DESC]),
};

export default TableHead;
