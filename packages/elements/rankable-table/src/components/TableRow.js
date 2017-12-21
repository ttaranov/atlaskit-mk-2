// @flow

import React from 'react';
import type { Node } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class TableRow extends React.Component {

    render() {
        const { isDraggable, isDragging, index, children } = this.props;


        return <Draggable draggableId={index}>
            {(provided, snapshot) => [
                <tr
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    style={provided.draggableStyle}
                 >
                 {React.Children.map(children, cell => {
                        return React.cloneElement(cell, {
                            isDraggable,
                            isDragging
                        })
                     })}

                 </tr>,
                provided.placeholder
            ]}
        </Draggable>;
    }
}