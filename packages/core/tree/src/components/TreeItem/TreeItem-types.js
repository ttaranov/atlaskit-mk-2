//@flow
import * as React from 'react';
import {
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DragHandleProps,
  type DraggingStyle,
  type NotDraggingStyle,
} from 'react-beautiful-dnd-next';
import type { ItemId, Path, TreeItem } from '../../types';

export type TreeDraggingStyle = {|
  ...DraggingStyle,
  paddingLeft: number,
  transition: 'none' | string,
|};

type TreeDraggableStyle = NotDraggingStyle | TreeDraggingStyle;

export type TreeDraggableProps = {|
  // Props that can be spread onto the element directly
  // inline style
  style: ?TreeDraggableStyle,
  // used for shared global styles
  'data-react-beautiful-dnd-draggable': string,
|};

export type DragActionType = null | 'mouse' | 'key' | 'touch';

export type RenderItemParams = {|
  /** Item to be rendered */
  item: TreeItem,
  /** The depth of the item on the tree. 0 means root level. */
  depth: number,
  /** Function to call when a parent item needs to be expanded */
  onExpand: () => void,
  /** Function to call when a parent item needs to be collapsed */
  onCollapse: () => void,
  /** Couple of Props to be spread into the rendered React.Components and DOM elements */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#children-function-render-props */
  provided: TreeDraggableProvided,
  /** Couple of state variables */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#2-snapshot-draggablestatesnapshot */
  snapshot: DraggableStateSnapshot,
|};

export type TreeDraggableProvided = {|
  draggableProps: TreeDraggableProps,
  // will be null if the draggable is disabled
  dragHandleProps: ?DragHandleProps,
  // The following props will be removed once we move to react 16
  innerRef: (?HTMLElement) => void,
|};

export type Props = {|
  item: TreeItem,
  path: Path,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
  renderItem: RenderItemParams => React.Node,
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
  itemRef: (itemId: ItemId, ?HTMLElement) => void,
  offsetPerLevel: number,
|};
