// @flow
import React, { Component } from 'react';
import { TableBodyCell } from '../styled/TableCell';
import type { HeadCellType, RowCellType } from '../types';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
  head: HeadCellType | void,
  cell: RowCellType,
  isFixedSize: boolean,
  isDragging: boolean,
};

type State = {
  width: number,
};

export default class Cell extends Component<Props, State> {
  state = {
    width: 0,
  }

  static defaultProps = {
    isDragging: false,
  }

  componentWillReceiveProps(nextProps: Props) {
    const wasDragging = this.props.isDragging;
    const willDragging = nextProps.isDragging;

    if (!willDragging && !wasDragging) {
      this.setState({
        width: this.ref.offsetWidth
      });
    }
  }  

  render() {
    const { cell, head, isFixedSize, isDragging } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width } = head || {};
    const { width: dragWidth } = this.state;

    return (
      <TableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isDragging={isDragging}
        dragWidth={dragWidth}
        isDraggable
        innerRef={ref => {this.ref = ref}}
      >
        {content}
      </TableBodyCell>
    );
  }
};