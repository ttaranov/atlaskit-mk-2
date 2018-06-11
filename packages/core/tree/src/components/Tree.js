// @flow
import React, { Component, Fragment } from 'react';
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';
import type { DragPosition, Props } from './Tree-types';
import { noop } from '../utils/handy';
import {
  flattenTree,
  getDestinationPath,
  getDragPosition,
  getSourcePath,
} from '../utils/tree';
import type { FlattenedItem, FlattenedTree, Path } from '../types';
import TreeItem from './TreeItem';

export default class Tree extends Component<Props> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
  };

  onDragEnd = (result: DropResult) => {
    const { tree, onDragEnd } = this.props;

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

    if (sourcePosition && destinationPosition) {
      onDragEnd(sourcePosition, destinationPosition);
    }
  };

  renderItems() {
    const { tree, renderItem, onExpand, onCollapse } = this.props;

    const items: FlattenedTree = flattenTree(tree);

    return items.map((flatItem: FlattenedItem, index: number) => (
      <Draggable
        draggableId={flatItem.item.id}
        index={index}
        key={flatItem.item.id}
      >
        {(provided, snapshot) => (
          <Fragment>
            <TreeItem
              key={flatItem.item.id}
              item={flatItem.item}
              path={flatItem.path}
              onExpand={onExpand}
              onCollapse={onCollapse}
              renderItem={renderItem}
              provided={provided}
              snapshot={snapshot}
            />
            {provided.placeholder}
          </Fragment>
        )}
      </Draggable>
    ));
  }

  render() {
    const renderedItems = this.renderItems();

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="list">
          {dropProvided => (
            <div ref={dropProvided.innerRef}>{renderedItems}</div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
