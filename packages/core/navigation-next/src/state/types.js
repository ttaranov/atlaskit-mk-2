// @flow

import type { Element, Node } from 'react';

/**
 * NavigationState
 */
export type InitialNavigationStateShape = {
  activeDrawer?: string | null,
  isHinting?: boolean,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};

export type NavigationStateShape = InitialNavigationStateShape & {
  isResizing?: boolean,
};

export type NavigationStateCacheGetter = () => NavigationStateShape;

export type NavigationStateCacheSetter = NavigationStateShape => void;

export type NavigationStateCache = {
  get: NavigationStateCacheGetter,
  set: NavigationStateCacheSetter,
};

export interface NavigationStateInterface {
  state: NavigationStateShape;

  collapseProductNav: () => void;
  expandProductNav: () => void;
  toggleProductNav: () => void;

  hint: () => void;
  unHint: () => void;
  toggleHint: () => void;

  peek: () => void;
  unPeek: () => void;
  togglePeek: () => void;

  openDrawer: (key: string) => void;
  closeActiveDrawer: () => void;

  openCreateDrawer: () => void;
  closeCreateDrawer: () => void;

  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;

  openNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;

  openPeopleDrawer: () => void;
  closePeopleDrawer: () => void;
}

/**
 * NavigationProvider
 */
export type NavigationProviderProps = {
  children: Element<*>,
  cache: NavigationStateCache | false,
  initialState?: InitialNavigationStateShape,
  debug?: boolean,
};

/**
 * NavigationSubscriber
 */
export type NavigationSubscriberProps = {
  children: NavigationStateInterface => Node,
};
