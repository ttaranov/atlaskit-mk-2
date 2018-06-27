// @flow
import * as React from 'react';
import type { TreeData, Path, ItemId } from '../../types';
import { type RenderItemParams } from '../TreeItem/TreeItem-types';

export type DragPosition = {|
  parentId: ItemId,
  index: number,
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
  isDragEnabled: boolean,
|};

export type State = {|
  dropAnimationOffset: number,
|};
