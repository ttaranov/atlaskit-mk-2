// @flow
import { type Element } from 'react';

export type RowData = Object;

export type ItemsDataType = Array<RowData>;

export type LoadableItems = ?Array<RowData> | null;

export type RenderFunction = Object => Element<*>;

export type CSSWidth = string | number;
