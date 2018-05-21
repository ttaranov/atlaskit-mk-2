// @flow
import * as React from 'react';
import type { Item, TargetPosition, TreeData } from '../types';

export type RenderItemParams = {|
  item: Item,
  depth: number,
  isDragging: boolean,
|};

export type Props = {|
  tree: TreeData,
  onExpand: (item: Item) => void,
  onCollapse: (item: Item) => void,
  onDragStart: (item: Item) => void,
  onDragEnd: (item: Item, targetItem: Item, position: TargetPosition) => void,
  renderItem: RenderItemParams => React.Node,
|};
