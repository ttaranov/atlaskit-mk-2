//@flow

export type TreeData = {
  rootId: ItemId,
  items: { [ItemId]: TreeItem },
};

export type ItemId = any;

export type TreeItemData = any;

export type TreeItem = {|
  id: ItemId,
  children: Array<ItemId>,
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

export type TreeSourcePosition = {|
  parentId: ItemId,
  index: number,
|};

export type TreeDestinationPosition = {|
  parentId: ItemId,
  index?: number,
|};
