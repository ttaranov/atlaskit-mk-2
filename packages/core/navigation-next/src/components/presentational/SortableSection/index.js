// @flow

import React, { Component } from 'react';
import {
  DragDropContext,
  type DropResult,
  type DragStart,
  type HookProvided,
} from 'react-beautiful-dnd';
import { LayoutEventEmitter } from '../LayoutManager/LayoutEvent';

import type { SortableSectionProps } from './types';
import Section from '../Section';

export default class SortableSection extends Component<SortableSectionProps> {
  onDragStart = (
    [start, provided]: [DragStart, HookProvided],
    emit: () => void,
  ) => {
    emit();
    if (this.props.onDragStart) {
      this.props.onDragStart(start, provided);
    }
  };

  onDragEnd = (
    [result, provided]: [DropResult, HookProvided],
    emit: () => void,
  ) => {
    emit();
    if (this.props.onDragEnd) {
      this.props.onDragEnd(result, provided);
    }
  };

  render() {
    const { children, ...sectionProps } = this.props;
    return (
      <LayoutEventEmitter>
        {({ emitItemDragStart, emitItemDragEnd }) => (
          <DragDropContext
            onDragUpdate={this.props.onDragUpdate}
            onDragStart={(...args) => this.onDragStart(args, emitItemDragStart)}
            onDragEnd={(...args) => this.onDragEnd(args, emitItemDragEnd)}
          >
            <Section {...sectionProps}>{children}</Section>
          </DragDropContext>
        )}
      </LayoutEventEmitter>
    );
  }
}
