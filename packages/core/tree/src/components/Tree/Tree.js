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
import {
  type TreeDraggableProvided,
  type TreeDraggingStyle,
} from '../TreeItem/TreeItem-types';

export default class Tree extends Component<Props, State> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
    paddingPerLevel: 35,
    // false by default for backward compatibility
    isDragEnabled: false,
  };

  state = {
    dropAnimationOffset: 0,
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
      dropAnimationOffset: 0,
    });
  };

  onDragUpdate = (update: DragUpdate) => {
    if (!update.destination) {
      return;
    }

    const source = update.source;
    const destination = update.destination;
    const dropAnimationOffset = this.calculatePendingDropAnimatingOffset(
      source,
      destination,
    );
    this.setState({
      dropAnimationOffset,
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

  calculatePendingDropAnimatingOffset = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ): number => {
    const { paddingPerLevel } = this.props;
    if (
      this.isMovingDown(source, destination) &&
      this.isTopOfSubtree(source, destination)
    ) {
      return paddingPerLevel;
    }
    return 0;
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

  isDraggable = (item: FlattenedItem): boolean =>
    this.props.isDragEnabled && !item.item.isExpanded;

  isMovingDown = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ): boolean => source.index < destination.index;

  isTopOfSubtree = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const { tree } = this.props;
    const flattenItems: FlattenedItem[] = flattenTree(tree);
    const destinationPath: Path = getDestinationPath(
      flattenItems,
      source.index,
      destination.index,
    );
    return flattenItems[destination.index].path.length < destinationPath.length;
  };

  patchDndProvided = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ): TreeDraggableProvided => {
    const { dropAnimationOffset } = this.state;

    if (
      !provided.draggableProps.style ||
      !provided.draggableProps.style.left ||
      !snapshot.isDropAnimating
    ) {
      // $FlowFixMe
      return provided;
    }

    const finalLeft = provided.draggableProps.style.left + dropAnimationOffset;
    const finalStyle: TreeDraggingStyle = {
      ...provided.draggableProps.style,
      // overwrite left position
      left: finalLeft,
      // animate so it doesn't jump immediately
      transition: 'left 0.277s ease-out',
    };
    // $FlowFixMe
    const finalProvided: TreeDraggableProvided = {
      ...provided,
      draggableProps: {
        ...provided.draggableProps,
        style: finalStyle,
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
        isDragDisabled={!this.isDraggable(flatItem)}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
          const finalProvided: TreeDraggableProvided = this.patchDndProvided(
            provided,
            snapshot,
          );
          return (
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
