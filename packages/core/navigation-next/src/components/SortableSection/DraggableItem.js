// @flow

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { SortableItem } from '../../';

export const DraggableItem = ({ draggableId, index, item }: *) => (
  <Draggable
    draggableId={draggableId}
    index={index}
    disableInteractiveElementBlocking
  >
    {(draggableProvided, draggableSnapshot) => {
      const draggableProps = {
        ...draggableProvided.draggableProps,
        ...draggableProvided.dragHandleProps,
      };

      // disable onClick if the intention was drag
      item.onClick = draggableSnapshot.isDragging ? null : item.onClick;

      return (
        <SortableItem
          draggableProps={draggableProps}
          innerRef={draggableProvided.innerRef}
          isDragging={draggableSnapshot.isDragging}
          {...item}
        />
      );
    }}
  </Draggable>
);
