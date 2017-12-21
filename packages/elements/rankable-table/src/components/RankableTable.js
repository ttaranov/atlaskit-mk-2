// @flow

import React from 'react';
import type { Node } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class EmptyState extends React.Component<Props> {

    state = {
        dragging: false
    }

    dragStart = () => {
        this.setState({
            dragging: true,
            cols: this.cols
        });
    }

    dragEnd = () => {
        this.setState({
            dragging: false,
            cols: []
        });

    }

    colDraggingStyle = (colIndex) => {

        const baseStyle = {
            boxSizing: 'border-box'
        }

        if (!this.state.dragging) {
            return baseStyle;
        }

        return {
            width: this.state.cols[colIndex],
            ...baseStyle
        }
    }


  render() {

    const sampleRow = (<tr>
        <td>Jeden</td>    
        <td>Dwa</td>    
        <td>Trzy</td>    
    </tr>);

    const rows = [sampleRow, sampleRow, sampleRow];

    this.cols = [];

    const computeInputIfNeeded = (rowIndex, colIndex, ref) => {
        if (rowIndex !== 0 || !ref) {
            return;
        }

        this.cols[colIndex] = ref.offsetWidth;

    }

    return (
        <DragDropContext
            onDragStart={this.dragStart}
            onDragEnd={this.dragEnd}
        >
        <table>

        <Droppable droppableId="droppable">
        {(provided, snapshot) => (
                    <tbody ref={provided.innerRef}>
            {rows.map((row, rowIndex) => {


                return <Draggable draggableId={rowIndex} key={rowIndex}>
                {(provided2, snapshot) => [
                    <tr ref={provided2.innerRef} {...provided2.dragHandleProps} style={provided2.draggableStyle}>
                        <td ref={(ref) => computeInputIfNeeded(rowIndex, 0, ref)} style={this.colDraggingStyle(0)}>Jeden {rowIndex}</td>
                        <td ref={(ref) => computeInputIfNeeded(rowIndex, 1, ref)} style={this.colDraggingStyle(1)}>Dwa {rowIndex}</td>
                        <td ref={(ref) => computeInputIfNeeded(rowIndex, 2, ref)} style={this.colDraggingStyle(2)}>{rowIndex !== 0 ? 'Trzy' : 'Trzy '.repeat(100)}</td>
                    </tr>,
                    (() => {
                        console.log(provided2);
                        console.log(snapshot);
                        return provided2.placeholder    
                    })()
                ]}
              </Draggable>
            })}
            {provided.placeholder}

            </tbody>
        )}
      </Droppable>
        </table>
        </DragDropContext>
    );
  }
}
