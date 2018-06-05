// @flow

import type { ComponentType } from 'react';

export type ItemArgs = {|
  actionAfter?: string,
  goTo?: string,
  icon?: ComponentType<{
    isActive: boolean,
    isHover: boolean,
    isSelected: boolean,
    spacing: 'compact' | 'default',
  }>,
  iconName?: string,
  id: string,
  isLoading?: boolean,
  isSelected?: boolean,
  lozenge?: string,
  onClick?: (SyntheticEvent<any>) => void,
  route?: string,
  target?: string,
  text?: string,
  type: string,
  url?: string,
|};

export type GroupArgs = {|
  id: string,
  items: ViewItem[],
  nestedGroupKey?: string,
  parentId?: string,
  type: string,
|};

export type ViewItem = ItemArgs | GroupArgs;

export type ViewKey = string;

export type View = {|
  items: ViewItem[],
  getSelectedItemId?: () => ?string,
|};

export type ViewResolver = () => View;

export type ReducerFn = (ViewItem[], ViewKey) => ViewItem[];

export type Reducer = {|
  source: string,
  fn: ReducerFn,
|};

export type ViewStateState = {|
  activeView: ViewKey | null,
  data: ViewItem[] | null,
  isLoading: boolean,
  nextView: ViewKey | null,
  selectedItemId: string | null,
|};

export type ComponentTypesMap = { [string]: ComponentType<any> };

export type ViewStateOptions = {|
  activeView?: ViewKey | null,
  reducers?: { [ViewKey]: Reducer[] },
  views?: { [ViewKey]: ViewResolver },
  debug?: boolean,
|};
