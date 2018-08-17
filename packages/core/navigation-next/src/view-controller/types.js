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
  type: ComponentType<*> | string,
  url?: string,
};

type ViewGroupArgs = {
  id: string,
  items: ViewData,
  nestedGroupKey?: string,
  parentId?: string,
  type: ComponentType<*> | string,
};

export type ViewData = Array<ViewItemArgs | ViewGroupArgs>;
export type ViewID = string;
export type ViewLayer = 'product' | 'container';
type GetItemsSignature = () => Promise<ViewData> | ViewData;

export type View = {
  id: ViewID,
  type: ViewLayer,
  getItems: GetItemsSignature,
};
type ActiveView = {
  id: ViewID,
  type: ViewLayer,
  data: ViewData,
};
type IncomingView = {
  id: ViewID,
  type: ?ViewLayer,
};

export type Reducer = ViewData => ViewData;

export type ViewControllerProps = {
  initialPeekViewId: ?ViewID,
  isDebugEnabled: boolean,
};

export type ViewControllerState = {
  activeView: ?ActiveView,
  incomingView: ?IncomingView,
  activePeekView: ?ActiveView,
  incomingPeekView: ?IncomingView,
};

export interface ViewControllerInterface {
  /** Properties */
  state: ViewControllerState;
  views: { [ViewID]: View };
  reducers: { [ViewID]: Reducer[] };
  initialPeekViewId: ?ViewID;
  isDebugEnabled: boolean;

  /** Methods */
  addView: View => void;
  removeView: ViewID => void;
  setView: ViewID => void;
  addReducer: (ViewID, Reducer) => void;
  removeReducer: (ViewID, Reducer) => void;
  setInitialPeekViewId: ViewID => void;
  updateActiveView: (ViewID | void) => void;
  setIsDebugEnabled: (isDebugEnabled: boolean) => void;
}
