// @flow
import React, { Component } from 'react';
import { RankableTableBodyCell } from '../../styled/rankable/TableCell';
import type { HeadCellType, RowCellType } from '../../types';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
  head: HeadCellType | void,
  cell: RowCellType,
  isFixedSize: boolean,
  isRanking: boolean,
};

type State = {
  width: number,
};

export default class Cell extends Component<Props, State> {
  ref: ?HTMLElement

  state = {
    width: 0,
  }

  static defaultProps = {
    isRanking: false,
  }

  componentWillReceiveProps(nextProps: Props) {
    const wasDragging = this.props.isRanking;
    const willDragging = nextProps.isRanking;

    if (!willDragging && !wasDragging && this.ref) {
      this.setState({
        width: this.ref.offsetWidth
      });
    }
  }  

  render() {
    const { cell, head, isFixedSize, isRanking } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width } = head || {};
    const { width: rankingWidth } = this.state;

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        rankingWidth={rankingWidth}
        innerRef={ref => {this.ref = ref}}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
};