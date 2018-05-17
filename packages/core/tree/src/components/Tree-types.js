// @flow
import React from 'react';
import type { Item, TargetPosition, TreeData } from '../types';

export type Props = {|
  tree: TreeData,
  onExpand: (item: Item) => void,
  onCollapse: (item: Item) => void,
  onDragStart: (item: Item) => void,
  onDragEnd: (item: Item, targetItem: Item, position: TargetPosition) => void,
  renderItem: ({
    item: Item,
    level: number,
    isDragged: boolean,
    isHovered: boolean,
  }) => any,
|};
