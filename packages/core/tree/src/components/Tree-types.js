// @flow
import * as React from 'react';
import type { TreeItem, TargetPosition, TreeData, Path } from '../types';

export type RenderItemParams = {|
  item: TreeItem,
  depth: number,
  onExpand: (item: TreeItem) => void,
  onCollapse: (item: TreeItem) => void,
|};

export type Props = {|
  tree: TreeData,
  onExpand: (item: TreeItem, path: Path) => void,
  onCollapse: (item: TreeItem, path: Path) => void,
  onDragStart: (item: TreeItem) => void,
  onDragEnd: (
    item: TreeItem,
    targetItem: TreeItem,
    position: TargetPosition,
  ) => void,
  renderItem: RenderItemParams => React.Node,
|};
