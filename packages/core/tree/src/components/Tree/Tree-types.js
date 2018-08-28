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
  dropAnimationOffset: number,
|};
