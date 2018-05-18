// @flow
import type { Item, TargetPosition, TreeData } from '../types';

export type RenderItemParams = {|
  item: Item,
  level: number,
  isDragged: boolean,
  isHovered: boolean,
|};

export type Props = {|
  tree: TreeData,
  onExpand: (item: Item) => void,
  onCollapse: (item: Item) => void,
  onDragStart: (item: Item) => void,
  onDragEnd: (item: Item, targetItem: Item, position: TargetPosition) => void,
  renderItem: RenderItemParams => any,
|};
