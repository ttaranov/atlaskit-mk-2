// @flow
import * as React from 'react';
import {
  type DraggableProvided,
  type DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import type { TreeItem, TreeData, Path, ItemId } from '../types';

export type DragPosition = {|
  parentId: ItemId,
  index: number,
|};

export type RenderItemParams = {|
  item: TreeItem,
  depth: number,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
|};

export type Props = {|
  tree: TreeData,
  onExpand: (itemId: ItemId, path: Path) => void,
  onCollapse: (itemId: ItemId, path: Path) => void,
  onDragStart: (itemId: ItemId) => void,
  onDragEnd: (
    sourcePosition: DragPosition,
    destinationPosition: DragPosition,
  ) => void,
  renderItem: RenderItemParams => React.Node,
  paddingPerLevel: number,
|};

export type State = {|
  dropAnimationOffset: number,
|};
