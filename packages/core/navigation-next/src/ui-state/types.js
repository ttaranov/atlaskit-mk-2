// @flow

import type { Node } from 'react';

import UIState from './UIState';

/**
 * UIState
 */
export type InitialUIStateShape = {
  isHinting?: boolean,
  isPeeking?: boolean,
  isCollapsed?: boolean,
  productNavWidth?: number,
};

export type UIStateShape = {
  isHinting: boolean,
  isPeeking: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
  isResizing: boolean,
};

export type UIStateCacheGetter = () => UIStateShape;

export type UIStateCacheSetter = UIStateShape => void;

export type UIStateCache = {
  get: UIStateCacheGetter,
  set: UIStateCacheSetter,
};

export interface UIStateInterface {
  state: UIStateShape;

  collapse: () => void;
  expand: () => void;
  toggleCollapse: () => void;

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
  children: UIState => Node,
};
