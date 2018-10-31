// @flow

import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Group from '../Group';
import type { SortableGroupProps } from './types';

const defaultStyles = {
  minHeight: 64,
  // Remove browser default button styles for rbdnd placeholder
  '& > button': {
    background: 'none',
    border: 'none',
    padding: 'none',
  },
};

export default class SortableGroup extends Component<SortableGroupProps> {
  render() {
    const { children, innerStyle, ...groupProps } = this.props;
    return (
      <Droppable droppableId={groupProps.id}>
        {droppableProvided => (
          <div
            ref={droppableProvided.innerRef}
            css={{ ...defaultStyles, ...innerStyle }}
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
  }
}
