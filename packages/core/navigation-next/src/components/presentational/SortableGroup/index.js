// @flow

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Group from '../Group';
import type { SortableGroupProps } from './types';

const defaultStyles = {
  minHeight: 64,
};

const SortableGroup = ({
  children,
  innerStyle,
  ...groupProps
}: SortableGroupProps) => (
  <Droppable droppableId={groupProps.id}>
    {droppableProvided => (
      <div
        ref={droppableProvided.innerRef}
        style={{ ...defaultStyles, ...innerStyle }}
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

export default SortableGroup;
