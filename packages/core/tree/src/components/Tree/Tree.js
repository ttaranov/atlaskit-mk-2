// @flow
import React, { Component, type Node } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext,
  type DragStart,
  type DropResult,
  type DragUpdate,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DroppableProvided,
} from 'react-beautiful-dnd';
import { getBox } from 'css-box-model';
import memoizeOne from 'memoize-one';
import {
  calculateFinalDropPositions,
  calculatePendingDropAnimatingOffset,
} from './Tree-utils';
import type { Props, State, DragState } from './Tree-types';
import { noop } from '../../utils/handy';
import { flattenTree } from '../../utils/tree';
import type { FlattenedItem, ItemId } from '../../types';
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
    flattenedTree: [],
  };

  // Action caused dragging
  dragAction: DragActionType = null;
  // State of dragging. Null when resting
  dragState: ?DragState = null;
  // HTMLElement for each rendered item
  itemsElement: { [ItemId]: ?HTMLElement } = {};
  // HTMLElement of the container element
  containerElement: ?HTMLElement;

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      flattenedTree: flattenTree(props.tree),
    };
  }

  onDragStart = (result: DragStart) => {
    this.dragState = {
      draggedItemId: result.draggableId,
      source: result.source,
      destination: result.source,
    };
  };

  onDragUpdate = (update: DragUpdate) => {
    if (!this.dragState) {
      return;
    }
    this.dragState = {
      ...this.dragState,
      destination: update.destination,
    };
  };

  onDragEnd = (result: DropResult) => {
    const { onDragEnd, tree } = this.props;
    const { flattenedTree } = this.state;
    const finalDragState: DragState = {
      ...this.dragState,
      source: result.source,
      destination: result.destination,
    };
    const { sourcePosition, destinationPosition } = calculateFinalDropPositions(
      tree,
      flattenedTree,
      finalDragState,
    );
    onDragEnd(sourcePosition, destinationPosition);
    this.dragState = null;
  };

  onDragAction = (actionType: DragActionType) => {
    this.dragAction = actionType;
  };

  onPointerMove = () => {
    if (this.dragState) {
      this.dragState = {
        ...this.dragState,
        horizontalLevel: this.getDroppedLevel(),
      };
    }
  };

  calculatePendingDropAnimatingOffset = memoizeOne(
    calculatePendingDropAnimatingOffset,
  );

  isDraggable = (item: FlattenedItem): boolean =>
    this.props.isDragEnabled && !item.item.isExpanded;

  getDroppedLevel = (): ?number => {
    const { offsetPerLevel } = this.props;

    if (!this.dragState || !this.containerElement) {
      return undefined;
    }

    const { draggedItemId } = this.dragState;
    const containerLeft = getBox(this.containerElement).contentBox.left;
    const itemElement = this.itemsElement[draggedItemId];
    if (itemElement) {
      const currentLeft: number = getBox(itemElement).borderBox.left;
      const relativeLeft: number = Math.max(currentLeft - containerLeft, 0);
      return (
        Math.floor((relativeLeft + offsetPerLevel / 2) / offsetPerLevel) + 1
      );
    }
    return undefined;
  };

  patchDraggableProvided = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ): TreeDraggableProvided => {
    const { offsetPerLevel } = this.props;
    const { flattenedTree } = this.state;

    if (
      // Patching is needed
      (!snapshot.isDropAnimating && this.dragAction !== 'key') ||
      // Patching is possible
      !provided.draggableProps.style ||
      !provided.draggableProps.style.left ||
      !this.dragState
    ) {
      // $ExpectError
      return provided;
    }

    const dropAnimationOffset: number = this.calculatePendingDropAnimatingOffset(
      flattenedTree,
      this.dragState,
      offsetPerLevel,
    );
    // During drop we apply some additional offset to the dropped item
    // in order to precisely land it at the right location
    // $ExpectError
    const finalStyle: TreeDraggingStyle = {
      ...provided.draggableProps.style,
      // overwrite left position
      // $ExpectError // This drives me crazy. Flow complains: property left is missing in null or undefined
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

  patchDroppableProvided = (provided: DroppableProvided): DroppableProvided => {
    return {
      ...provided,
      innerRef: (el: ?HTMLElement) => {
        this.containerElement = el;
        provided.innerRef(el);
      },
    };
  };

  setItemRef = (itemId: ItemId, el: ?HTMLElement) => {
    this.itemsElement[itemId] = el;
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
          const finalProvided: TreeDraggableProvided = this.patchDraggableProvided(
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
              itemRef={this.setItemRef}
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
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragUpdate={this.onDragUpdate}
      >
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => {
            const finalProvided: DroppableProvided = this.patchDroppableProvided(
              provided,
            );
            return (
              <div
                ref={finalProvided.innerRef}
                onTouchMove={this.onPointerMove}
                onMouseMove={this.onPointerMove}
                {...finalProvided.droppableProps}
              >
                {renderedItems}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  }
}
