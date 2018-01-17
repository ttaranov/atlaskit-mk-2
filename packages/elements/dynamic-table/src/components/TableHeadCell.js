// @flow
import React, { type Node, Component } from 'react';
import { HeadCell } from '../styled/TableHead';
import type { SortOrderType } from '../types';

export type Props = {
  sortKey?: string,
  isSortable?: boolean,
  sortOrder?: SortOrderType,
  isFixedSize?: boolean,
  innerRef?: (?HTMLElement) => void,
  inlineStyles?: {},
  content: Node,
  onClick: ?Function,
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
