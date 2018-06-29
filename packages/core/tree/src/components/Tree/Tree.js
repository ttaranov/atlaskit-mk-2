// @flow
import React, { Component, type Node } from 'react';
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
  type DragHandleProps,
} from 'react-beautiful-dnd';
import type { DragPosition, Props, State, MovementType } from './Tree-types';
import { noop } from '../../utils/handy';
import { flattenTree, getItem } from '../../utils/tree';
import { getDestinationPath, getSourcePath } from '../../utils/flat-tree';
import type { FlattenedItem, Path, TreeData } from '../../types';
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
    offsetPerLevel: 35,
  };

  state = {
    dropAnimationOffset: 0,
    flattenedTree: [],
  };

  moveBy: MovementType = null;

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      flattenedTree: flattenTree(props.tree),
    };
  }

  static getDragPosition = (tree: TreeData, path: Path): DragPosition => {
    const parentPath = path.slice(0, -1);
    const parent = getItem(tree, parentPath);
    return {
      parentId: parent.id,
      index: path.slice(-1)[0],
    };
  };

  onDragEnd = (result: DropResult) => {
    const { onDragEnd } = this.props;
    const source = result.source;
    const destination = result.destination;

    const {
      sourcePosition,
      destinationPosition,
    } = this.calculateFinalDropPositions(source, destination);

    onDragEnd(sourcePosition, destinationPosition);

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

  /*
    Translates a drag&drop movement from a purely index based flat list style to tree-friendly `DragPosition` data structure 
    to make it available in the onDragEnd callback.  
   */
  calculateFinalDropPositions = (
    source: DraggableLocation,
    destination: ?DraggableLocation,
  ): { sourcePosition: DragPosition, destinationPosition: ?DragPosition } => {
    const { tree } = this.props;
    const { flattenedTree } = this.state;
    const sourcePath: Path = getSourcePath(flattenedTree, source.index);
    const sourcePosition: DragPosition = Tree.getDragPosition(tree, sourcePath);

    if (!destination) {
      return { sourcePosition, destinationPosition: null };
    }

    const destinationPath: Path = getDestinationPath(
      flattenedTree,
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
    const { offsetPerLevel } = this.props;
    if (
      this.isMovingDown(source, destination) &&
      this.isTopOfSubtree(source, destination)
    ) {
      return offsetPerLevel;
    }
    return 0;
  };

  isMovingDown = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ): boolean => source.index < destination.index;

  isTopOfSubtree = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    const { flattenedTree } = this.state;

    const destinationPath: Path = getDestinationPath(
      flattenedTree,
      source.index,
      destination.index,
    );
    return (
      flattenedTree[destination.index].path.length < destinationPath.length
    );
  };

  patchDragHandleProps = (
    dragHandleProps: ?DragHandleProps,
  ): ?DragHandleProps => {
    if (dragHandleProps) {
      return {
        ...dragHandleProps,
        onMouseDown: (event: MouseEvent) => {
          this.moveBy = 'mouse';
          if (dragHandleProps) {
            dragHandleProps.onMouseDown(event);
          }
        },
        onKeyDown: (event: KeyboardEvent) => {
          this.moveBy = 'key';
          if (dragHandleProps) {
            dragHandleProps.onKeyDown(event);
          }
        },
        onTouchStart: (event: TouchEvent) => {
          this.moveBy = 'touch';
          if (dragHandleProps) {
            dragHandleProps.onTouchStart(event);
          }
        },
      };
    }
    return null;
  };

  patchDndProvided = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ): TreeDraggableProvided => {
    const { dropAnimationOffset } = this.state;

    // $FlowFixMe
    let finalProvided: TreeDraggableProvided = {
      ...provided,
      dragHandleProps: this.patchDragHandleProps(provided.dragHandleProps),
    };

    if (
      !finalProvided.draggableProps.style ||
      !finalProvided.draggableProps.style.left ||
      //$ExpectError
      (!snapshot.isDropAnimating && this.moveBy !== 'key')
    ) {
      // $FlowFixMe
      return finalProvided;
    }
    const finalLeft =
      finalProvided.draggableProps.style.left + dropAnimationOffset;
    const finalStyle: TreeDraggingStyle = {
      ...finalProvided.draggableProps.style,
      // overwrite left position
      left: finalLeft,
      // animate so it doesn't jump immediately
      transition: 'left 0.277s ease-out',
    };
    // $FlowFixMe
    finalProvided = {
      ...finalProvided,
      draggableProps: {
        ...provided.draggableProps,
        style: finalStyle,
      },
    };
    console.log('patching offset');
    return finalProvided;
  };

  renderItems = (): Array<Node> => {
    const { renderItem, onExpand, onCollapse } = this.props;
    const { flattenedTree } = this.state;

    return flattenedTree.map((flatItem: FlattenedItem, index: number) => (
      <Draggable
        draggableId={flatItem.item.id}
        index={index}
        key={flatItem.item.id}
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
