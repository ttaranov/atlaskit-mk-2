// @flow
import { type Element } from 'react';
import Row from './components/Row';

// flowlint-next-line unclear-type:off
export type RowData = Object;

export type ItemsDataType = Array<RowData>;

// prettier-ignore
export type ItemsProvider = (
  // flowlint-next-line unclear-type:off
  Object | void
) => void | ItemsDataType | Promise<void | ItemsDataType>;

// flowlint-next-line unclear-type:off
export type RenderFunction = Object => Element<typeof Row>;

export type CSSWidth = string | number;
