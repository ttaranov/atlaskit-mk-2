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
import withSortedPageRows, {
  type WithSortedPageRowsProps,
} from '../../hoc/withSortedPageRows';
import withDimensions, {
  type WithDimensionsProps,
} from '../../hoc/withDimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';

type Props = WithDimensionsProps &
  WithSortedPageRowsProps & {
    onRankStart: RankStart => void,
    onRankEnd: RankEnd => void,
    isFixedSize: boolean,
    isRanking: boolean,
    isRankingDisabled: boolean,
    head: HeadType | void,
  };

// computes destination of ranking
// - if drag was cancelled returns undefined
// - if drag was finished, returns new position and after/before key
const computeRankDestination = (
  result: DropResult,
  pageRows: RowType[],
): RankEndLocation | void => {
  const {
    source: { index: sourceIndex },
    destination,
  } = result;
  if (destination) {
    const { index } = destination;

    const keyIndex = index < sourceIndex ? index - 1 : index;
    const afterKey = keyIndex !== -1 ? pageRows[keyIndex].key : undefined;
    const beforeIndex = keyIndex === -1 ? 0 : keyIndex + 1;
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

export class RankableBody extends Component<Props, {}> {
  innerRef = (innerRefFn: Function) => (ref: HTMLElement) => {
    innerRefFn(ref);
    this.props.innerRef(ref);
  };

  onDragStart = (dragStart: DragStart) => {
    const {
      draggableId: key,
      source: { index },
    } = dragStart;
    const rankStartProps = {
      index,
      key,
    };

    this.props.onRankStart(rankStartProps);
  };

  onDragEnd = (result: DropResult) => {
    const { pageRows, onRankEnd } = this.props;
    const {
      draggableId: sourceKey,
      source: { index: sourceIndex },
    } = result;
    const destination = computeRankDestination(result, pageRows);

    const rankEndProps = {
      sourceIndex,
      sourceKey,
      destination,
    };

    onRankEnd(rankEndProps);
  };

  render() {
    const {
      pageRows,
      head,
      isFixedSize,
      isRanking,
      refWidth,
      refHeight,
      isRankingDisabled,
    } = this.props;
    const inlineStyle = inlineStylesIfRanking(isRanking, refWidth, refHeight);

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="dynamic-table-droppable"
          isDropDisabled={isRankingDisabled}
        >
          {provided => (
            <RankableTableBody
              innerRef={this.innerRef(provided.innerRef)}
              isRanking={isRanking}
              style={inlineStyle}
              {...provided.droppableProps}
            >
              {pageRows.map((row, rowIndex) => (
                <TableRow
                  head={head}
                  isRanking={isRanking}
                  isFixedSize={isFixedSize}
                  key={row.key}
                  rowIndex={rowIndex}
                  row={row}
                  isRankingDisabled={isRankingDisabled}
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
