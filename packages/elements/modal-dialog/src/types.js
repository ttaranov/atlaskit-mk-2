// @flow
import { Component, type Node, type Element } from 'react';

export type ChildrenType = Node;
export type ComponentType = Component<{}, {}>;
export type ElementType = Element<any>;
export type FunctionType = (...args: Array<any>) => mixed;
export type KeyboardOrMouseEvent =
  | SyntheticMouseEvent<any>
  | SyntheticKeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';
