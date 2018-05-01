// @flow
import { type Node } from 'react';

export type ChildrenType = Node;
// flowlint-next-line unclear-type:off
export type ComponentType = any;
// flowlint-next-line unclear-type:off
export type ElementType = any;
// flowlint-next-line unclear-type:off
export type FunctionType = (...args: Array<any>) => mixed;
export type KeyboardOrMouseEvent =
  // flowlint-next-line unclear-type:off
  | SyntheticMouseEvent<any>
  // flowlint-next-line unclear-type:off
  | SyntheticKeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';
