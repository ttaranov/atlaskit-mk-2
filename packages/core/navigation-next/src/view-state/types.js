// @flow

import type { ComponentType } from 'react';

type ViewItemArgs = {
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
};

type ViewGroupArgs = {
  id: string,
  items: ViewData,
  nestedGroupKey?: string,
  parentId?: string,
  type: string,
};

export type ViewData = Array<ViewItemArgs | ViewGroupArgs>;
export type ViewID = string;
export type ViewLayer = 'product' | 'container';
export type View = {
  id: ViewID,
  type: ViewLayer,
  getItems: () => ViewData,
};

export type Reducer = ViewData => ViewData;

export type ViewStateProps = {
  isDebugEnabled: boolean,
};

export type ViewStateState = {
  // Product layer
  productViewId: ?ViewID,
  productViewData: ?ViewData,
  incomingProductViewId: ?ViewID,

  // Container layer
  containerViewId: ?ViewID,
  containerViewData: ?ViewData,
  incomingContainerViewId: ?ViewID,

  // Product home view
  homeViewId: ?ViewID,
};

export interface ViewStateInterface {
  /** Properties */
  state: ViewStateState;
  views: { [ViewID]: View };
  reducers: { [ViewID]: Reducer[] };
  isDebugEnabled: boolean;

  /** Methods */
  addView: View => void;
  removeView: ViewID => void;
  setView: ViewID => void;
  addReducer: (ViewID, Reducer) => void;
  removeReducer: (ViewID, Reducer) => void;
  clearContainerView: () => void;
  setHomeView: ViewID => void;
  updateActiveView: (ViewID | void) => void;
  setIsDebugEnabled: (isDebugEnabled: boolean) => void;
}
