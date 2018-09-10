// @flow

import React, { Component, Fragment } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import type { SortableSectionProps } from './types';
import { Group, SortableItem, Section } from '../../';

const noop = () => {};

export default class SortableSection extends Component<SortableSectionProps> {
  static defaultProps = {
    onDragEnd: noop,
  };

  onDragStart = () => {
    document.body.style.pointerEvents = 'none';
  };

  onDragEnd = result => {
    document.body.style.pointerEvents = null;
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

    const start = groups[startId];
    const finish = groups[finishId];

    // same group
    if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);
      const newGroup = { ...start, itemIds: newItemIds };
      const newGroups = { ...groups, [startId]: newGroup };

      this.props.onDragEnd(newGroups, result);
      return;
    }

    // moving between groups
    const startItemIds = Array.from(start.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = { ...start, itemIds: startItemIds };

    const finishItemIds = Array.from(finish.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, itemIds: finishItemIds };

    const newGroups = {
      ...groups,
      [startId]: newStart,
      [finishId]: newFinish,
    };

    this.props.onDragEnd(newGroups, result);
  };

  render() {
    const { groups, groupIds, id: sectionId, items, parentId } = this.props;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Section parentId={parentId} id={sectionId}>
          {({ css }) => (
            <Fragment>
              {groupIds.map(groupId => {
                const group = groups[groupId];
                return (
                  <Droppable droppableId={groupId} key={groupId}>
                    {droppableProvided => (
                      <div
                        ref={droppableProvided.innerRef}
                        style={{ ...css, minHeight: 48 }}
                        {...droppableProvided.droppableProps}
                      >
                        <Group
                          hasSeparator={group.hasSeparator}
                          heading={group.heading}
                          id={groupId}
                        >
                          {group.itemIds.map((itemId, index) => {
                            const item = items[itemId];
                            return (
                              <Draggable
                                key={itemId}
                                draggableId={itemId}
                                index={index}
                                disableInteractiveElementBlocking
                              >
                                {(draggableProvided, draggableSnapshot) => {
                                  const draggableProps = {
                                    ...draggableProvided.draggableProps,
                                    ...draggableProvided.dragHandleProps,
                                  };

                                  // disable onClick if the intention was drag
                                  item.onClick = draggableSnapshot.isDragging
                                    ? null
                                    : item.onClick;

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
                          })}
                          {droppableProvided.placeholder}
                        </Group>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </Fragment>
          )}
        </Section>
      </DragDropContext>
    );
  }
}
