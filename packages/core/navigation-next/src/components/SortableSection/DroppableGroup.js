// @flow

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { Group } from '../../';

export const DroppableGroup = ({ children, id, innerStyle, groupProps }: *) => (
  <Droppable droppableId={id}>
    {droppableProvided => (
      <div
        ref={droppableProvided.innerRef}
        style={innerStyle}
        {...droppableProvided.droppableProps}
      >
        <Group {...groupProps} id={id}>
          {children}
          {droppableProvided.placeholder}
        </Group>
      </div>
    )}
  </Droppable>
);
