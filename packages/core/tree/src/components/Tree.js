// @flow
import React, { Component, Fragment } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext,
  type DropResult,
  type DragUpdate,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import type { DragPosition, Props, State } from './Tree-types';
import { noop } from '../utils/handy';
import {
  flattenTree,
  getDestinationPath,
  getDragPosition,
  getSourcePath,
} from '../utils/tree';
import type { FlattenedItem, FlattenedTree, Path } from '../types';
import TreeItem from './TreeItem';

export default class Tree extends Component<Props, State> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
    paddingPerLevel: 35,
  };

  state = {
    dropAnimationOffset: 0,
  };

  onDragEnd = (result: DropResult) => {
    const { tree, onDragEnd } = this.props;

    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    const flattenItems: FlattenedItem[] = flattenTree(tree);

    const sourcePath: Path = getSourcePath(flattenItems, source.index);
    const sourcePosition: ?DragPosition = getDragPosition(tree, sourcePath);

    const destinationPath: Path = getDestinationPath(
      flattenItems,
      source.index,
      destination.index,
    );
    const destinationPosition: ?DragPosition = getDragPosition(
      tree,
      destinationPath,
    );

    this.setState({
      dropAnimationOffset: 0,
    });

    if (sourcePosition && destinationPosition) {
      onDragEnd(sourcePosition, destinationPosition);
    }
  };

  onDragUpdate = (update: DragUpdate) => {
    const { tree, paddingPerLevel } = this.props;

    const source = update.source;
    const destination = update.destination;

    const flattenItems: FlattenedItem[] = flattenTree(tree);

    const destinationPath: Path = getDestinationPath(
      flattenItems,
      source.index,
      destination.index,
    );

    let pendingAnimationOffset = 0;

    if (
      source.index < destination.index &&
      flattenItems[destination.index].path.length < destinationPath.length
    ) {
      pendingAnimationOffset = paddingPerLevel;
    }

    this.setState({
      dropAnimationOffset: pendingAnimationOffset,
    });
  };

  patchDndProvided = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ): DraggableProvided => {
    const { dropAnimationOffset } = this.state;

    const finalProvided: DraggableProvided = !snapshot.isDropAnimating
      ? provided
      : {
          ...provided,
          draggableProps: {
            ...provided.draggableProps,
            style: {
              ...provided.draggableProps.style,
              transition: 'left 0.277s ease-out',
              left: provided.draggableProps.style.left + dropAnimationOffset,
            },
          },
        };
    return finalProvided;
  };

  renderItems = () => {
    const { tree, renderItem, onExpand, onCollapse } = this.props;

    const items: FlattenedTree = flattenTree(tree);

    return items.map((flatItem: FlattenedItem, index: number) => (
      <Draggable
        draggableId={flatItem.item.id}
        index={index}
        key={flatItem.item.id}
      >
        {(provided, snapshot) => {
          const finalProvided = this.patchDndProvided(provided, snapshot);
          return (
            <Fragment>
              <TreeItem
                key={flatItem.item.id}
                item={flatItem.item}
                path={flatItem.path}
                onExpand={onExpand}
                onCollapse={onCollapse}
                renderItem={renderItem}
                provided={finalProvided}
                snapshot={snapshot}
              />
              {provided.placeholder}
            </Fragment>
          );
        }}
      </Draggable>
    ));
  };

  render() {
    const renderedItems = this.renderItems();

    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable droppableId="list">
          {dropProvided => (
            <div ref={dropProvided.innerRef}>{renderedItems}</div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
