// @flow
import React, { Component } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext,
  type DropResult,
  type DragUpdate,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DraggableLocation,
  type DroppableProvided,
} from 'react-beautiful-dnd';
import type { DragPosition, Props, State } from './Tree-types';
import { noop } from '../../utils/handy';
import {
  flattenTree,
  getDestinationPath,
  getSourcePath,
  getItem,
} from '../../utils/tree';
import type { FlattenedItem, FlattenedTree, Path, TreeData } from '../../types';
import TreeItem from '../TreeItem';

export default class Tree extends Component<Props, State> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
  };

  state = {
    pendingPath: null,
  };

  onDragEnd = (result: DropResult) => {
    const { onDragEnd } = this.props;

    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;
    const {
      sourcePosition,
      destinationPosition,
    } = this.calculateFinalDropPositions(source, destination);

    if (sourcePosition && destinationPosition) {
      onDragEnd(sourcePosition, destinationPosition);
    }

    this.setState({
      pendingPath: null,
    });
  };

  onDragUpdate = (update: DragUpdate) => {
    if (!update.destination) {
      return;
    }
    const pendingPath = this.calculatePendingPath(
      update.source,
      update.destination,
    );
    this.setState({
      pendingPath,
    });
  };

  calculateFinalDropPositions = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ): { sourcePosition: ?DragPosition, destinationPosition: ?DragPosition } => {
    const { tree } = this.props;
    const flattenItems: FlattenedItem[] = flattenTree(tree);
    const sourcePath: Path = getSourcePath(flattenItems, source.index);
    const sourcePosition: ?DragPosition = Tree.getDragPosition(
      tree,
      sourcePath,
    );
    const destinationPath: Path = getDestinationPath(
      flattenItems,
      source.index,
      destination.index,
    );
    const destinationPosition: ?DragPosition = Tree.getDragPosition(
      tree,
      destinationPath,
    );
    return { sourcePosition, destinationPosition };
  };

  calculatePendingPath = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ): Path => {
    const { tree } = this.props;
    const flattenItems: FlattenedItem[] = flattenTree(tree);
    return getDestinationPath(flattenItems, source.index, destination.index);
  };

  static getDragPosition = (tree: TreeData, path: Path): ?DragPosition => {
    const parentPath = path.slice(0, -1);
    const parent = getItem(tree, parentPath);
    if (parent) {
      return {
        parentId: parent.id,
        index: path.slice(-1)[0],
      };
    }
    return null;
  };

  renderItems = () => {
    const { tree, renderItem, onExpand, onCollapse } = this.props;
    const { pendingPath } = this.state;

    const items: FlattenedTree = flattenTree(tree);

    return items.map((flatItem: FlattenedItem, index: number) => (
      <Draggable
        draggableId={flatItem.item.id}
        index={index}
        key={flatItem.item.id}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
          const finalPath =
            snapshot.isDragging && pendingPath ? pendingPath : flatItem.path;
          return (
            <TreeItem
              key={flatItem.item.id}
              item={flatItem.item}
              path={finalPath}
              onExpand={onExpand}
              onCollapse={onCollapse}
              renderItem={renderItem}
              provided={provided}
              snapshot={snapshot}
            />
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
          {(provided: DroppableProvided) => (
            <div ref={provided.innerRef}>{renderedItems}</div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
