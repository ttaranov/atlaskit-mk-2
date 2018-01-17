// @flow
import React, { Component } from 'react';
import {
  DragDropContext,
  Droppable,
  type DropResult,
  type DragStart,
} from 'react-beautiful-dnd';
import { RankableTableBody } from '../../styled/rankable/TableBody';
import TableRow from './TableRow';
import type {
  HeadType,
  RowType,
  RankStart,
  RankEnd,
  RankEndLocation,
} from '../../types';
import withSortedPageRows from '../../hoc/withSortedPageRows';
import withDimensions, {
  type WithDimensionsProps,
} from '../../hoc/withDimensions';

type Props = WithDimensionsProps & {
  onRankStart: RankStart => void,
  onRankEnd: RankEnd => void,
  pageRows: RowType[],
  isFixedSize: boolean,
  isRanking: boolean,
  head: HeadType | void,
};

const computeRankDestination = (
  result: DropResult,
  pageRows: RowType[],
): ?RankEndLocation => {
  if (result.destination) {
    const { index } = result.destination;

    const afterKey = index !== 0 ? pageRows[index].key : undefined;
    const beforeIndex = index === 0 ? 0 : index + 1;
    const beforeKey =
      beforeIndex < pageRows.length ? pageRows[beforeIndex].key : undefined;

    return {
      index,
      afterKey,
      beforeKey,
    };
  }

  return undefined;
};

class RankableBody extends Component<Props, {}> {
  innerRef = (innerRefFn: Function) => (ref: HTMLElement) => {
    innerRefFn(ref);
    this.props.innerRef(ref);
  };

  onDragStart = (dragStart: DragStart) => {
    const { draggableId: key, source: { index } } = dragStart;
    const rankStartProps = {
      index,
      key,
    };

    this.props.onRankStart(rankStartProps);
  };

  onDragEnd = (result: DropResult) => {
    const { pageRows, onRankEnd } = this.props;
    const { draggableId: sourceKey, source: { index: sourceIndex } } = result;
    const destination = computeRankDestination(result, pageRows);

    const rankEndProps = {
      sourceIndex,
      sourceKey,
      destination,
    };

    onRankEnd(rankEndProps);
  };

  render() {
    const { pageRows, head, isFixedSize, isRanking, refWidth } = this.props;
    const inlineStyle = isRanking ? { width: refWidth } : {};

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="dynamic-table-droppable">
          {provided => (
            <RankableTableBody
              innerRef={this.innerRef(provided.innerRef)}
              isRanking={isRanking}
              style={inlineStyle}
            >
              {pageRows.map((row, rowIndex) => (
                <TableRow
                  head={head}
                  isRanking={isRanking}
                  isFixedSize={isFixedSize}
                  key={rowIndex} // eslint-disable-line react/no-array-index-key
                  rowIndex={rowIndex}
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
