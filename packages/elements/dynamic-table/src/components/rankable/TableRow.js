// @flow
import React, { Component } from 'react';
import { RankableTableBodyRow } from '../../styled/rankable/TableRow';
import type { HeadType, RowType } from '../../types';
import { Draggable } from 'react-beautiful-dnd';
import TableCell from './TableCell';

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  row: RowType,
  isRanking: boolean,
};

type State = {
  width: number,
}

export default class RankableRow extends Component<Props, State> {
  ref: ?HTMLElement

  state = {
    width: 0,
  }

  componentWillReceiveProps(nextProps: Props) {
    const wasRanking = this.props.isRanking;
    const willRanking = nextProps.isRanking;

    if (!willRanking && !wasRanking && this.ref) {
      this.setState({
        width: this.ref.offsetWidth
      });
    }
  }  

  addRef = (innerRefFn) => {
    return (ref) => {
      innerRefFn(ref);
      this.ref = ref;
    }
  }

  render() {

    const width = this.state.width;

    const { row, head, isFixedSize, isRanking } = this.props;
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
          width={width}
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
        <td colSpan="4" style={{padding: "0"}}>
          <div style={{height: '48px', width: `${width}px`}}>
            {provided.placeholder}
          </div>
        </td>
      </tr> : null
      ]}
      </Draggable>
    );
  }
};
