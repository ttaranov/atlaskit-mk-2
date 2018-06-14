// @flow
import * as React from 'react';
import type {
  TreeItem,
  TargetPosition,
  TreeData,
  Path,
  ItemId,
} from '../types';

export type RenderItemParams = {|
  item: TreeItem,
  depth: number,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
|};

export type Props = {|
  tree: TreeData,
  onExpand: (itemId: ItemId, path: Path) => void,
  onCollapse: (itemId: ItemId, path: Path) => void,
  onDragStart: (itemId: ItemId) => void,
  onDragEnd: (
    itemId: ItemId,
    targetId: ItemId,
    position: TargetPosition,
  ) => void,
  renderItem: RenderItemParams => React.Node,
|};
