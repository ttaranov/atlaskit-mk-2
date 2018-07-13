// @flow

import type { Node } from 'react';

import UIState from './UIState';

/**
 * UIState
 */
export type InitialUIStateShape = {
  isPeekHinting?: boolean,
  isPeeking?: boolean,
  isCollapsed?: boolean,
  productNavWidth?: number,
};

export type UIStateShape = {
  isPeekHinting: boolean,
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

  peekHint: () => void;
  unPeekHint: () => void;
  togglePeekHint: () => void;

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
