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

  componentWillReceiveProps(nextProps: Props) {
    const wasDragging = this.props.isRanking;
    const willDragging = nextProps.isRanking;

    if (!willDragging && !wasDragging) {
      this.props.updateDimensions();
    }
  }  

  render() {
    const { cell, head, isFixedSize, isRanking, width: rankingWidth } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width } = head || {};

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        rankingWidth={rankingWidth}
        innerRef={this.props.innerRef}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
};

export default withDimensions(RankableTableCell);