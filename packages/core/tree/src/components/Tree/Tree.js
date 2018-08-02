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
} from 'react-beautiful-dnd';
import type { Props, State } from './Tree-types';
import { noop } from '../../utils/handy';
import { flattenTree, getTreePosition } from '../../utils/tree';
import {
  getDestinationPath,
  getSourcePath,
  getFlatItemPath,
} from '../../utils/flat-tree';
import type { FlattenedItem, Path, TreePosition } from '../../types';
import TreeItem from '../TreeItem';
import {
  type TreeDraggableProvided,
  type TreeDraggingStyle,
  type DragActionType,
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
    isDragEnabled: false,
  };

  state = {
    dropAnimationOffset: 0,
    flattenedTree: [],
  };

  lastDragAction: DragActionType = null;

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      flattenedTree: flattenTree(props.tree),
    };
  }

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

  onDragAction = (actionType: DragActionType) => {
    this.lastDragAction = actionType;
  };

  /*
    Translates a drag&drop movement from a purely index based flat list style to tree-friendly `TreePosition` data structure 
    to make it available in the onDragEnd callback.  
   */
  calculateFinalDropPositions = (
    source: DraggableLocation,
    destination: ?DraggableLocation,
  ): { sourcePosition: TreePosition, destinationPosition: ?TreePosition } => {
    const { tree } = this.props;
    const { flattenedTree } = this.state;
    const sourcePath: Path = getSourcePath(flattenedTree, source.index);
    const sourcePosition: TreePosition = getTreePosition(tree, sourcePath);

    if (!destination) {
      return { sourcePosition, destinationPosition: null };
    }

    const destinationPath: Path = getDestinationPath(
      flattenedTree,
      source.index,
      destination.index,
    );
    const destinationPosition: ?TreePosition = getTreePosition(
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
    const { flattenedTree } = this.state;

    if (!destination) {
      return 0;
    }

    const destinationPath: Path = getDestinationPath(
      flattenedTree,
      source.index,
      destination.index,
    );
    const displacedPath: Path = getFlatItemPath(
      flattenedTree,
      destination.index,
    );
    const offsetDifference: number =
      destinationPath.length - displacedPath.length;
    return offsetDifference * offsetPerLevel;
  };

  isDraggable = (item: FlattenedItem): boolean =>
    this.props.isDragEnabled && !item.item.isExpanded;

  patchDndProvided = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ): TreeDraggableProvided => {
    const { dropAnimationOffset } = this.state;

    if (
      // Patching is needed
      (!snapshot.isDropAnimating && this.lastDragAction !== 'key') ||
      // Patching is possible
      !provided.draggableProps.style ||
      !provided.draggableProps.style.left
    ) {
      // $ExpectError
      return provided;
    }
    // During drop we apply some additional offset to the dropped item
    // in order to precisely land it at the right location
    const finalStyle: TreeDraggingStyle = {
      ...provided.draggableProps.style,
      // overwrite left position
      left: provided.draggableProps.style.left + dropAnimationOffset,
      // animate so it doesn't jump immediately
      transition: 'left 0.277s ease-out',
    };
    // $ExpectError
    const finalProvided: TreeDraggableProvided = {
      ...provided,
      draggableProps: {
        ...provided.draggableProps,
        style: finalStyle,
      },
    };
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
              onDragAction={this.onDragAction}
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
