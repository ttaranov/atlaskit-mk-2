// @flow
import { type Element } from 'react';
import Row from './components/Row';

export type RowData = Object;

export type ItemsDataType = Array<RowData>;

// prettier-ignore
export type ItemsProvider = (
  Object | void
) => void | ItemsDataType | Promise<void | ItemsDataType>;

export type RenderFunction = Object => Element<typeof Row>;

export type ItemsRenderedFunction = Function;

export type CSSWidth = string | number;
