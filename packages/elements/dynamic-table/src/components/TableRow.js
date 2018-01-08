// @flow
import React, { Component } from 'react';
import { TableBodyRow } from '../styled/TableRow';
import type { HeadType, RowType } from '../types';
import { Draggable } from 'react-beautiful-dnd';
import TableCell from './TableCell';

type Props = {
  head: HeadType | void,
  isFixedSize: boolean,
  row: RowType,
  isDragging: boolean,
};

type State = {
  width: number,
}

export default class Row extends Component<Props, State> {
  state = {
    width: 0,
  }


  componentWillReceiveProps(nextProps: Props) {
    const wasDragging = this.props.isDragging;
    const willDragging = nextProps.isDragging;

    if (!willDragging && !wasDragging) {
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

    const dragWidth = this.state.width;

    const { row, head, isFixedSize, isDragging } = this.props;
    const { cells, ...restRowProps } = row;

    return (
      <Draggable draggableId={row.key}>
      {(provided, snapshot) => [
        <TableBodyRow {...restRowProps} 
          innerRef={this.addRef(provided.innerRef)} 
          {...provided.dragHandleProps}
          style={provided.draggableStyle}
          isDragging={isDragging}
          isCurrentlyDragging={snapshot.isDragging}
          isDraggable
          dragWidth={dragWidth}
        >
        {cells.map((cell, cellIndex) => {
          const headCell = (head || { cells: [] }).cells[cellIndex];
  
          return <TableCell 
            head={headCell} 
            cell={cell} 
            isDragging={isDragging}
            key={cellIndex} // eslint-disable-line react/no-array-index-key
            isFixedSize={isFixedSize}
          />;
        })}
      </TableBodyRow>,
   
      provided.placeholder ? <tr>
        <td colSpan="4" style={{padding: "0"}}>
          <div style={{height: '48px', width: `${dragWidth}px`}}>
            {provided.placeholder}
          </div>
        
        </td>
      </tr> : null
      ]}
      </Draggable>
    );
  }
};
