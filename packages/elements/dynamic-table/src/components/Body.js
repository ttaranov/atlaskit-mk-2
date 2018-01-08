// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { ASC } from '../internal/constants';
import { getPageRows, validateSortKey } from '../internal/helpers';
import TableRow from './TableRow';
import type { HeadType, RowType, SortOrderType } from '../types';
import { DragDropContext, Droppable, type DragStart as RankStart, type DropResult as RankEnd } from 'react-beautiful-dnd';

export type {RankStart, RankEnd};

const getSortedRows = (head, rows, sortKey, sortOrder) => {
  if (!sortKey || !head) return rows;
  if (!rows) return [];

  const getSortingCellValue = cells =>
    cells.reduce(
      (result, cell, index) =>
        result ||
        (head &&
          head.cells[index].key === sortKey &&
          (cell.key !== undefined ? cell.key : cell.content)),
      null,
    );

  return rows.sort((a, b) => {
    const valA = getSortingCellValue(a.cells);
    const valB = getSortingCellValue(b.cells);

    const modifier = sortOrder === ASC ? 1 : -1;
    // $FlowFixMe
    if (!valA || valA < valB) return -modifier;
    // $FlowFixMe
    if (!valB || valA > valB) return modifier;
    return 0;
  });
};

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  page: number,
  rows: Array<RowType> | void,
  rowsPerPage?: number,
  sortKey?: void | string,
  sortOrder: SortOrderType,
  onRankStart?: (RankStart) => void,
  onRankEnd?: (RankEnd) => void,
};

type State = {
  isDragging: boolean,
  width: number,
}

const TBody = styled.tbody`
  ${props => props.isDragging? "cursor: grabbing;" : "cursor: grab;"}
  ${({isDragging, width}) => isDragging && css`display: block; width: ${width}px`}
`;

export default class Body extends Component<Props, State> {
  componentWillMount() {
    validateSortKey(this.props.sortKey, this.props.head);
  }

  static defaultProps = {
    onRankStart: () => {},
    onRankEnd: () => {},
  }

  state = {
    isDragging: false,
    width: 0,
  }
  dragStart = (rankStart: RankStart) => {
    this.setState({
      isDragging: true,
      width: this.ref.offsetWidth,
    });
    this.props.onRankStart(rankStart);
  }
  dragEnd = (rankEnd: RankEnd) => {
    this.setState({
      isDragging: false,
    });
  this.props.onRankEnd(rankEnd);
  }

  addRef = (innerRefFn) => {
    return (ref) => {
      innerRefFn(ref);
      this.ref = ref;
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.sortKey !== nextProps.sortKey ||
      this.props.head !== nextProps.head
    ) {
      validateSortKey(nextProps.sortKey, nextProps.head);
    }
  }
  render() {
    const {
      rows,
      head,
      sortKey,
      sortOrder,
      rowsPerPage,
      page,
      isFixedSize,
    } = this.props;
    const {
      isDragging,
      width
    } = this.state;

    const sortedRows = getSortedRows(head, rows, sortKey, sortOrder) || [];
    const pageRows = getPageRows(page, sortedRows, rowsPerPage);

    return (
      <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <TBody innerRef={this.addRef(provided.innerRef)} isDragging={isDragging} width={width}>
            {pageRows.map((row, rowIndex) => (
              <TableRow
                head={head}
                isDragging={isDragging}
                isFixedSize={isFixedSize}
                key={rowIndex} // eslint-disable-line react/no-array-index-key
                row={row}
              />
            ))}
            {provided.placeholder}
          </TBody>
  
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
