//@flow

export type TreeData = Item;

export type ItemId = any;

export type ItemData = any;

export type Item = {|
  id: ItemId,
  children: Array<Item>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: ItemData,
|};

export type FlattenedTree = Array<FlattenedItem>;

export type Path = Array<ItemId>;

export type FlattenedItem = {|
  item: Item,
  path: Path,
|};

export type TargetPosition = 'above' | 'below' | 'ontop';
