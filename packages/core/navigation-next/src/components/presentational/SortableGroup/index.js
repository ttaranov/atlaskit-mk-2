// @flow

import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Group from '../Group';
import type { SortableGroupProps } from './types';

const defaultStyles = {
  minHeight: 64,
};

export default class SortableGroup extends Component<SortableGroupProps> {
  render() {
    const { children, innerStyle, ...groupProps } = this.props;
    return (
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
  }
}
