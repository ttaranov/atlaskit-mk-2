//@flow

export type TreeData = TreeItem;

export type ItemId = any;

export type TreeItemData = any;

export type TreeItem = {|
  id: ItemId,
  children: Array<TreeItem>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};

export type FlattenedTree = Array<FlattenedItem>;

export type Path = Array<number>;

export type FlattenedItem = {|
  item: TreeItem,
  path: Path,
|};

export type TargetPosition = 'above' | 'below' | 'ontop';
