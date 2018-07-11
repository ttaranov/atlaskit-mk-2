// @flow

import type { Node } from 'react';

/**
 * UIState
 */
export type InitialUIStateShape = {
  isHinting?: boolean,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};

export type UIStateShape = InitialUIStateShape & {
  isResizing?: boolean,
};

export type UIStateCacheGetter = () => UIStateShape;

export type UIStateCacheSetter = UIStateShape => void;

export type UIStateCache = {
  get: UIStateCacheGetter,
  set: UIStateCacheSetter,
};

export interface UIStateInterface {
  state: UIStateShape;

  collapseProductNav: () => void;
  expandProductNav: () => void;
  toggleProductNav: () => void;

  hint: () => void;
  unHint: () => void;
  toggleHint: () => void;

  peek: () => void;
  unPeek: () => void;
  togglePeek: () => void;
}

/**
 * UIStateSubscriber
 */
export type UIStateSubscriberProps = {
  children: UIStateInterface => Node,
};
