// @flow
import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RankableTableBody } from '../../styled/rankable/TableBody';
import TableRow from './TableRow';
import type { HeadType, RowType, RankStart, RankEnd } from '../../types';
import withSortedPageRows from '../../hoc/withSortedPageRows';
import withDimensions, {type WithDimensionsProps} from '../../hoc/withDimensions';

type Props = {
  onRankStart: (RankStart) => void,
  onRankEnd: (RankEnd) => void,
  pageRows: RowType[],
  isFixedSize: boolean,
  isRanking: boolean,
  head: HeadType | void,
} & WithDimensionsProps;

class RankableBody extends Component<Props, {}> {

  dragStart = (rankStart: RankStart) => {
    this.props.updateDimensions();
    this.props.onRankStart(rankStart);
  }

  dragEnd = (rankEnd: RankEnd) => {
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
      isRanking,
      width,
    } = this.props;

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