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
  children: ItemArgs[],
  id?: string,
  type: string,
  // key?: string,
  // parentId?: string,
|};

export type ViewKey = string;

export type View = GroupArgs[];

export type ViewData = { id: ViewKey, parentId: ?ViewKey, view: View };

export type ViewResolver = () => ViewData;

export type Reducer = (ViewData, ViewKey) => ViewData;

export type NavAPIState = {|
  activeView: ViewKey | null,
  data: ViewData | null,
  isLoading: boolean,
  nextView: ViewKey | null,
|};

export type ComponentTypesMap = { [string]: ComponentType<any> };

export type NavAPIOptions = {|
  activeView?: ViewKey | null,
  reducers?: { [ViewKey]: Reducer[] },
  views?: { [ViewKey]: ViewResolver },
  debug?: boolean,
|};
