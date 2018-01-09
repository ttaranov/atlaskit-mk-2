// @flow
import React, { Component } from 'react';
import { RankableTableBody } from '../../styled/rankable/TableBody';
import TableRow from './TableRow';
import type { HeadType, RowType, RankStart, RankEnd } from '../../types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import withSortedPageRows from '../../hoc/withSortedPageRows';
import withDimensions, {type WithDimensionsProps} from '../../hoc/withDimensions';

type Props = {
  onRankStart: (RankStart) => void,
  onRankEnd: (RankEnd) => void,
  pageRows: RowType[],
  isFixedSize: boolean,
  head: HeadType | void,
} & WithDimensionsProps;

type State = {
  isRanking: boolean,
};

class RankableBody extends Component<Props, State> {
  state = {
    isRanking: false,
  }

  dragStart = (rankStart: RankStart) => {
    this.props.updateDimensions();
    this.setState({
      isRanking: true,
    });
    this.props.onRankStart(rankStart);
  }

  dragEnd = (rankEnd: RankEnd) => {
    this.setState({
      isRanking: false,
    });
    this.props.onRankEnd(rankEnd);
  }

  innerRef = (innerRefFn: Function) => (ref: HTMLElement) => {
    innerRefFn(ref);
    this.props.innerRef(ref);
  }

  render() {
    const {
      pageRows,
      head,  
      isFixedSize,
      width,
    } = this.props;
    const {
      isRanking,
    } = this.state;

    return (
      <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
        <Droppable droppableId="dynamic-table-droppable">
          {(provided) => (
            <RankableTableBody 
              innerRef={this.innerRef(provided.innerRef)}
              isRanking={isRanking} 
              width={width}
            >
              {pageRows.map((row, rowIndex) => (
                <TableRow
                  head={head}
                  isRanking={isRanking}
                  isFixedSize={isFixedSize}
                  key={rowIndex} // eslint-disable-line react/no-array-index-key
                  row={row}
                />
              ))}
              {provided.placeholder}
            </RankableTableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default withDimensions(withSortedPageRows(RankableBody));