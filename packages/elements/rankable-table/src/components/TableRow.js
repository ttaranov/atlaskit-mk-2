// @flow

import React from 'react';
import type { Node } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class TableRow extends React.Component {

  render() {

    const sampleRow = (<tr>
        <td>Jeden</td>    
        <td>Dwa</td>    
        <td>Trzy</td>    
    </tr>);

    const rows = [sampleRow, sampleRow, sampleRow];

    return [
        <tr ref={provided2.innerRef} {...provided2.dragHandleProps} style={provided2.draggableStyle}>
        <td>Jeden {rowIndex}</td>
        <td>Dwa {rowIndex}</td>
        <td>Trzy {rowIndex}</td>
    </tr>,

    ]
        <DragDropContext
            onDragStart={() => console.log('DragDropContext.onDragStart', ...arguments)}
            onDragEnd={() => console.log('DragDropContext.onDragEnd', ...arguments)}
        >
        <table>

        <Droppable droppableId="droppable">
        {(provided, snapshot) => (
                <tbody ref={provided.innerRef}>
            {rows.map((row, rowIndex) => {


                return <Draggable draggableId={rowIndex} key={rowIndex}>
                {(provided2, snapshot) => [
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
