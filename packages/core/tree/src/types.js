//@flow

export type TreeData = Item;

export type ItemId = any;

export type ItemData = any;

export type Item = {|
  id: ItemId,
  children: Array<Item>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isLoading?: boolean,
  data?: ItemData,
|};

export type FlattenTree = Array<FlattenItem>;

export type Path = Array<ItemId>;

export type FlattenItem = {|
  item: Item,
  path: Path,
|};

export type TargetPosition = 'above' | 'below' | 'ontop';
