// @flow
import { type Node } from 'react';

export type ChildrenType = Node;
export type ComponentType = any;
export type ElementType = any;
export type FunctionType = (...args: Array<any>) => mixed;
export type KeyboardOrMouseEvent =
  | SyntheticMouseEvent<any>
  | SyntheticKeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';
