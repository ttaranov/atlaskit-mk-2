// @flow

import React, { Component } from 'react';
import {
  DragDropContext,
  type DropResult,
  type DragStart,
  type HookProvided,
} from 'react-beautiful-dnd';

import type { SortableSectionProps } from './types';
import Section from '../Section';

export default class SortableSection extends Component<SortableSectionProps> {
  onDragStart = (start: DragStart, provided: HookProvided) => {
    // avoid unintentional interaction with other elements
    if (document && document.body && document.body.style) {
      document.body.style.pointerEvents = 'none';
    }

    if (this.props.onDragStart) {
      this.props.onDragStart(start, provided);
    }
  };

  onDragEnd = (result: DropResult, provided: HookProvided) => {
    if (document && document.body && document.body.style) {
      document.body.style.pointerEvents = '';
    }

    // short-circuit the potentially expensive operations below if the consumer
    // wants to handle onDragEnd themselves
    if (this.props.onDragEnd) {
      this.props.onDragEnd(result, provided);
    }
  };

  render() {
    const { children, ...sectionProps } = this.props;

    return (
      <DragDropContext
        onDragUpdate={this.props.onDragUpdate}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Section {...sectionProps}>{children}</Section>
      </DragDropContext>
    );
  }
}
