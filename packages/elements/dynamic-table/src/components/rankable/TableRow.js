// @flow
import React, { Component } from 'react';
import { RankableTableBodyRow } from '../../styled/rankable/TableRow';
import { RowPlaceholderCell, RowPlaceholderWrapper } from '../../styled/rankable/RowPlaceholder';
import type { HeadType, RowType } from '../../types';
import { Draggable } from 'react-beautiful-dnd';
import withDimensions, {type WithDimensionsProps} from '../../hoc/withDimensions';
import TableCell from './TableCell';

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  row: RowType,
  isRanking: boolean,
} & WithDimensionsProps;

class RankableTableRow extends Component<Props, {}> {
  componentWillReceiveProps(nextProps: Props) {
    const wasRanking = this.props.isRanking;
    const willRanking = nextProps.isRanking;

    if (!willRanking && !wasRanking) {
      this.props.updateDimensions();
    }
  }  

  addRef = (innerRefFn) => {
    return (ref) => {
      innerRefFn(ref);
      this.props.innerRef(ref);
    }
  }

  render() {
    const { row, head, isFixedSize, isRanking, width, height } = this.props;
    const { cells, ...restRowProps } = row;

    return (
      <Draggable draggableId={row.key}>
      {(provided, snapshot) => [
        <RankableTableBodyRow {...restRowProps} 
          innerRef={this.addRef(provided.innerRef)} 
          {...provided.dragHandleProps}
          style={provided.draggableStyle}
          isRanking={isRanking}
          isRankingItem={snapshot.isDragging}
          rankWidth={width}
        >
        {cells.map((cell, cellIndex) => {
          const headCell = (head || { cells: [] }).cells[cellIndex];
  
          return <TableCell 
            head={headCell} 
            cell={cell} 
            isRanking={isRanking}
            key={cellIndex} // eslint-disable-line react/no-array-index-key
            isFixedSize={isFixedSize}
          />;
        })}
      </RankableTableBodyRow>,
   
      provided.placeholder ? <tr>
        <RowPlaceholderCell colSpan={cells.length}>
          <RowPlaceholderWrapper
            height={height}
            width={width}
          >
            {provided.placeholder}
          </RowPlaceholderWrapper>
        </RowPlaceholderCell>
      </tr> : null
      ]}
      </Draggable>
    );
  }
};

export default withDimensions(RankableTableRow);