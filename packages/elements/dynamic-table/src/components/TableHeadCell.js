// @flow
import React, { Component } from 'react';
import { HeadCell } from '../styled/TableHead';
import type { SortOrderType, HeadCellType } from '../types';

export type Props = {
  cell: HeadCellType,
  index: number,
  sortKey: ?string,
  sortOrder?: SortOrderType,
  isFixedSize?: boolean,
  onSort: Function,
  innerRef?: (?HTMLElement) => void,
  inlineStyles?: {},
  content: Node,
};

class TableHeadCell extends Component<Props, {}> {

  static defaultProps = {
    innerRef: () => {},
    inlineStyles: {},
  }

  render() {
    const { content, inlineStyles, ...restCellProps } = this.props;

    return (
      <HeadCell
        style={inlineStyles}
        {...restCellProps}
      >
        <span>{content}</span>
      </HeadCell>
    );
  }
}

export default TableHeadCell;
