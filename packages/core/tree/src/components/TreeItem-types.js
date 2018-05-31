//@flow
import * as React from 'react';
import type { Path, TreeItem } from '../types';
import type { RenderItemParams } from './Tree-types';

export type Props = {|
  item: TreeItem,
  path: Path,
  onExpand: (item: TreeItem, path: Path) => void,
  onCollapse: (item: TreeItem, path: Path) => void,
  renderItem: RenderItemParams => React.Node,
|};
