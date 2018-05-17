// @flow
import type { Item, TargetPosition, TreeData } from './types';
import React from 'react';

export type Props = {|
  tree: TreeData,
  onExpand: (item: Item) => void,
  onCollapse: (item: Item) => void,
  onDragStart: (item: Item) => void,
  onDragEnd: (item: Item, targetItem: Item, position: TargetPosition) => void,
  renderItem: (
    item: Item,
    isDragged: boolean,
    isHovered: boolean,
    isInvalid: boolean,
  ) => React.Node,
  treeIndentation: number,
|};
