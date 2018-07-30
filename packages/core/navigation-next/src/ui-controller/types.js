// @flow

import type { Node } from 'react';

import UIController from './UIController';

/**
 * UIController
 */
export type InitialUIControllerShape = {
  isPeekHinting?: boolean,
  isPeeking?: boolean,
  isCollapsed?: boolean,
  productNavWidth?: number,
};

export type UIControllerShape = {
  isCollapsed: boolean,
  isPeekHinting: boolean,
  isPeeking: boolean,
  isResizing: boolean,
  productNavWidth: number,
};

export type UIControllerCacheGetter = () => UIControllerShape;

export type UIControllerCacheSetter = UIControllerShape => void;

export type UIControllerCache = {
  get: UIControllerCacheGetter,
  set: UIControllerCacheSetter,
};

export interface UIControllerInterface {
  state: UIControllerShape;

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
 * UIControllerSubscriber
 */
export type UIControllerSubscriberProps = {
  children: UIController => Node,
};
