// @flow
import { Component, type Element } from 'react';

export type ChildrenType = Array<Element<any>> | Element<any>;
export type ComponentType = Component<{}, {}, {}>;
export type ElementType = Element<mixed>;
export type FunctionType = (...args: Array<any>) => mixed;
