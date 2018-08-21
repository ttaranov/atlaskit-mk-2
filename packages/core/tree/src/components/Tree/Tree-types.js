// @flow
import * as React from 'react';
import type {
  TreeData,
  Path,
  ItemId,
  FlattenedTree,
  TreePosition,
} from '../../types';
import { type RenderItemParams } from '../TreeItem/TreeItem-types';

export type Props = {|
  /** The tree data structure. */
  tree: TreeData,
  /** Function that will be called when a parent item needs to be expanded. */
  onExpand: (itemId: ItemId, path: Path) => void,
  /** Function that will be called when a parent item needs to be collapsed. */
  onCollapse: (itemId: ItemId, path: Path) => void,
  /** Function that will be called when the user starts dragging. */
  onDragStart: (itemId: ItemId) => void,
  /** Function that will be called when the user finishes dragging. */
  onDragEnd: (
    sourcePosition: TreePosition,
    destinationPosition: ?TreePosition,
  ) => void,
  /** Function that will be called to render a single item. */
  renderItem: RenderItemParams => React.Node,
  /** Number of pixel is used to scaffold the tree by the consumer. */
  offsetPerLevel: number,
  /** Boolean to turn on drag&drop re-ordering on the tree */
  isDragEnabled: boolean,
|};

export type State = {|
  /** The flattened tree data structure transformed from props.tree */
  flattenedTree: FlattenedTree,
  dropAnimationOffset: number,
|};
