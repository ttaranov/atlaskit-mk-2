// @flow
import React, { Component } from 'react';
import { RankableTableBodyCell } from '../../styled/rankable/TableCell';
import type { HeadCellType, RowCellType } from '../../types';
import { Draggable } from 'react-beautiful-dnd';
import withDimensions, {type WithDimensionsProps} from '../../hoc/withDimensions';

type Props = {
  head: HeadCellType | void,
  cell: RowCellType,
  isFixedSize: boolean,
  isRanking: boolean,
} & WithDimensionsProps;

class RankableTableCell extends Component<Props, {}> {

  render() {
    const { cell, head, isFixedSize, isRanking, innerRef, refWidth } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width } = head || {};
    const inlineStyles = isRanking ? {width: refWidth} : {};

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        style={inlineStyles}
        innerRef={innerRef}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
};

export default withDimensions(RankableTableCell);