// @flow
import * as React from 'react';
import { type DraggableLocation } from 'react-beautiful-dnd';
import type {
  TreeData,
  Path,
  ItemId,
  FlattenedTree,
  TreePosition,
} from '../../types';
import { type RenderItemParams } from '../TreeItem/TreeItem-types';

export type Props = {|
  tree: TreeData,
  onExpand: (itemId: ItemId, path: Path) => void,
  onCollapse: (itemId: ItemId, path: Path) => void,
  onDragStart: (itemId: ItemId) => void,
  onDragEnd: (
    sourcePosition: TreePosition,
    destinationPosition: ?TreePosition,
  ) => void,
  renderItem: RenderItemParams => React.Node,
  offsetPerLevel: number,
  isDragEnabled: boolean,
|};

export type State = {|
  flattenedTree: FlattenedTree,
|};

export type DragState = {|
  // Id of the currently dragged item
  draggedItemId: ItemId,
  // Source location
  source: DraggableLocation,
  // Pending destination location
  destination?: ?DraggableLocation,
  // Last level, while the user moved an item horizontally
  horizontalLevel?: ?number,
|};
