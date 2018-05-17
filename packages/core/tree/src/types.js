//@flow

export type TreeData = Item;

export type Item = {|
  id: any,
  children: Array<Item>,
  hasChildren: boolean,
  isExpanded: boolean,
  isLoading: boolean,
  data: any,
|};

export type TargetPosition = 'above' | 'below' | 'ontop';
