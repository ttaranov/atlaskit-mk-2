// @flow
import { type Element, type Node } from 'react';

export type ChildrenType = Array<any> | Node | Element<any>;
export type ComponentType = any;
export type ElementType = Element<any>;
export type FunctionType = (...args: Array<any>) => mixed;
export type ActionsType = Array<{
  onClick?: any => void,
  text?: string,
}>;
