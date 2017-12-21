// @flow

import React from 'react';
import type { Node } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

type Props = {}
export default class EmptyState extends React.Component<Props> {

  state = {
    isDragging: false,
  };

  dragStart = () => {
    this.setState({
        isDragging: true,
    });
  };

  dragEnd = () => {
    this.setState({
      isDragging: false,
    });
  };

  render() {

    const {children} = this.props;

    return (      
        <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
        <table>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <tbody ref={provided.innerRef}>
              {React.Children.map(children, (row, rowIndex) => {
                return React.cloneElement(row, {
                    index: rowIndex,
                    isDraggable: true,
                    isDragging: this.state.isDragging
                })
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
