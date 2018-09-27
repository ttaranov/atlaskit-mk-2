// @flow

import React, { Component, Fragment } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import type { SortableSectionProps } from './types';
import { Section } from '../../';

import { DraggableItem } from './DraggableItem';
import { DroppableGroup } from './DroppableGroup';

const noop = () => {};
const pluck = (arr, key, val) => arr.find(x => x[key] === val);

export default class SortableSection extends Component<SortableSectionProps> {
  static defaultProps = {
    onChange: noop,
  };

  onDragStart = start => {
    // avoid unintentional interaction with other elements
    document.body.style.pointerEvents = 'none';

    if (this.props.onDragStart) {
      this.props.onDragStart(start);
    }
  };

  onDragEnd = result => {
    document.body.style.pointerEvents = null;

    // warn about handlers
    if (this.props.onChange && this.props.onDragEnd) {
      console.warn(
        'SortableSection: The `onChange` handler is ignored when `onDragEnd` is provided.\n\nPlease provide one or the other.',
      );
    }

    // short-circuit the potentially expensive operations below if the consumer
    // wants to handle onDragEnd themselves
    if (this.props.onDragEnd) {
      this.props.onDragEnd(result);
      return;
    }

    // begin sorting logic
    const { destination, source, draggableId } = result;
    const { groups } = this.props;

    if (!destination) {
      return; // dropped outside target area
    }

    const startId = source.droppableId;
    const finishId = destination.droppableId;

    if (finishId === startId && destination.index === source.index) {
      return; // dropped in its original position
    }

    const start = pluck(groups, 'id', startId);
    const finish = pluck(groups, 'id', finishId);

    // same group
    if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);
      const newGroup = { ...start, itemIds: newItemIds };
      const newGroups = groups.map(g => {
        if (g.id === startId) return newGroup;
        return g;
      });

      this.props.onChange(newGroups, result);
      return;
    }

    // moving between groups
    const startItemIds = Array.from(start.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = { ...start, itemIds: startItemIds };

    const finishItemIds = Array.from(finish.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, itemIds: finishItemIds };

    const newGroups = groups.map(g => {
      if (g.id === startId) return newStart;
      if (g.id === finishId) return newFinish;
      return g;
    });

    this.props.onChange(newGroups, result);
  };

  render() {
    const { groups, items, ...sectionProps } = this.props;

    return (
      <DragDropContext
        onDragBeforeStart={this.props.onDragBeforeStart}
        onDragUpdate={this.props.onDragUpdate}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Section {...sectionProps}>
          {({ css }) => (
            <Fragment>
              {groups.map(group => {
                return (
                  <DroppableGroup
                    droppableId={group.id}
                    groupProps={group}
                    innerStyle={{ ...css, minHeight: 64 }}
                    key={group.id}
                  >
                    {group.itemIds.map((itemId, index) => {
                      const item = items[itemId];

                      return (
                        <DraggableItem
                          item={item}
                          key={itemId}
                          draggableId={itemId}
                          index={index}
                        />
                      );
                    })}
                  </DroppableGroup>
                );
              })}
            </Fragment>
          )}
        </Section>
      </DragDropContext>
    );
  }
}
