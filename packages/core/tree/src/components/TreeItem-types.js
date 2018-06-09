//@flow
import * as React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import type { ItemId, Path, TreeItem } from '../types';
import type { RenderItemParams } from './Tree-types';

export type Props = {|
  item: TreeItem,
  path: Path,
  onExpand: (itemId: ItemId, path: Path) => void,
  onCollapse: (itemId: ItemId, path: Path) => void,
  renderItem: RenderItemParams => React.Node,
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
|};
