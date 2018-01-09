// @flow
import React, { Component } from 'react';
import { RankableTableBody } from '../../styled/rankable/TableBody';
import TableRow from './TableRow';
import type { HeadType, RowType, RankStart, RankEnd } from '../../types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import withSortedPageRows from '../../hoc/withSortedPageRows';

type Props = {
  onRankStart: (RankStart) => void,
  onRankEnd: (RankEnd) => void,
  pageRows: RowType[],
  isFixedSize: boolean,
  head: HeadType | void,
};

type State = {
  isRanking: boolean,
  width: number
};

class RankableBody extends Component<Props, State> {
  state = {
    isRanking: false,
    width: 0,
  }

  ref: ?HTMLElement;

  dragStart = (rankStart: RankStart) => {
    this.setState({
      isRanking: true,
      width: this.ref ? this.ref.offsetWidth : 0,
    });
    this.props.onRankStart(rankStart);
  }

  dragEnd = (rankEnd: RankEnd) => {
    this.setState({
      isRanking: false,
    });
    this.props.onRankEnd(rankEnd);
  }

  setRef = (innerRefFn: Function) => {
    return (ref: HTMLElement) => {
      innerRefFn(ref);

      this.ref = ref;
    }
  }

  render() {
    const {
      pageRows,
      head,  
      isFixedSize,
    } = this.props;
    const {
      isRanking,
      width,
    } = this.state;

    return (
      <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
        <Droppable droppableId="dynamic-table-droppable">
          {(provided) => (
            <RankableTableBody 
              innerRef={this.setRef(provided.innerRef)}
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

export default withSortedPageRows(RankableBody);