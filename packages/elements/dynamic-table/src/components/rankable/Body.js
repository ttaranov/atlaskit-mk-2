// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { ASC } from '../../internal/constants';
import { getPageRows, validateSortKey } from '../../internal/helpers';
import TableRow from '../TableRow';
import type { HeadType, RowType, SortOrderType, RankStart, RankEnd } from '../../types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

type Props = {
    onRankStart: (RankStart) => void,
    onRankEnd: (RankEnd) => void,
};

type State = {
    isRanking: boolean,
    width: number
};

export default class RankableBody extends Component<Props, State> {
    state = {
        isRanking: false,
        width: 0,
    }

    ref: HTMLElement | null;

    dragStart = (rankStart: RankStart) => {
        this.setState({
            isRanking: true,
            width: this.ref.offsetWidth,
        });
        this.props.onRankStart(rankStart);
    }
    dragEnd = (rankEnd: RankEnd) => {
        this.setState({
            isRanking: false,
        });
        this.props.onRankEnd(rankEnd);
    }

    addRef = (innerRefFn: Function) => {
        return (ref: HTMLElement) => {
            innerRefFn(ref);

            this.ref = ref;
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