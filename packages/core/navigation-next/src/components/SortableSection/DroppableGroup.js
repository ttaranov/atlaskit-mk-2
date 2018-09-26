// @flow

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { Group } from '../../';

export const DroppableGroup = ({
  children,
  droppableId,
  groupProps,
  innerStyle,
}: *) => (
  <Droppable droppableId={droppableId}>
    {droppableProvided => (
      <div
        ref={droppableProvided.innerRef}
        style={innerStyle}
        {...droppableProvided.droppableProps}
      >
        <Group {...groupProps}>
          {children}
          {droppableProvided.placeholder}
        </Group>
      </div>
    )}
  </Droppable>
);
