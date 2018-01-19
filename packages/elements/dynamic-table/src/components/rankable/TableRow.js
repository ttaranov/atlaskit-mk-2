// @flow
import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { RankableTableBodyRow } from '../../styled/rankable/TableRow';
import { RowPlaceholderCell } from '../../styled/rankable/RowPlaceholder';
import type { HeadType, RowType } from '../../types';
import withDimensions, {
  type WithDimensionsProps,
} from '../../hoc/withDimensions';
import TableCell from './TableCell';
import { inlineStylesIfRanking } from '../../internal/helpers';

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  row: RowType,
  isRanking: boolean,
  rowIndex: number,
} & WithDimensionsProps;

export class RankableTableRow extends Component<Props, {}> {
  innerRef = (innerRefFn: Function) => (ref: ?HTMLElement) => {
    innerRefFn(ref);
    this.props.innerRef(ref);
  };

  render() {
    const {
      row,
      head,
      isFixedSize,
      isRanking,
      refWidth,
      refHeight,
      rowIndex,
    } = this.props;
    const { cells, ...restRowProps } = row;
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

    if (!row.key) {
      console.warn(
        `Ranking may not work properly because key was not pass to table row. Row index (${rowIndex}) will be used instead`,
      ); // eslint-disable-line
    }

    const key = row.key ? row.key : rowIndex.toString();

    return (
      <Draggable draggableId={key} index={rowIndex}>
        {(provided, snapshot) => [
          <RankableTableBodyRow
            {...restRowProps}
            innerRef={this.innerRef(provided.innerRef)}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            style={{ ...provided.draggableProps.style, ...inlineStyles }}
            isRanking={isRanking}
            isRankingItem={snapshot.isDragging}
            key={0}
          >
            {cells.map((cell, cellIndex) => {
              const headCell = (head || { cells: [] }).cells[cellIndex];

              return (
                <TableCell
                  head={headCell}
                  cell={cell}
                  isRanking={isRanking}
                  key={cellIndex} // eslint-disable-line react/no-array-index-key
                  isFixedSize={isFixedSize}
                />
              );
            })}
          </RankableTableBodyRow>,

          provided.placeholder ? (
            <tr key={1}>
              <RowPlaceholderCell colSpan={cells.length}>
                <div
                  style={inlineStylesIfRanking(isRanking, refWidth, refHeight)}
                >
                  {provided.placeholder}
                </div>
              </RowPlaceholderCell>
            </tr>
          ) : null,
        ]}
      </Draggable>
    );
  }
}

export default withDimensions(RankableTableRow);
