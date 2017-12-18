// @flow
import { type Node } from 'react';

export type DataFunction = Object => Array | Promise<Array>;

export type RenderFunction = Object => Node;

export type CSSWidth = string | number;

export type RowData = Object<any>;
