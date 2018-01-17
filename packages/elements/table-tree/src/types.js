// @flow
import { type Element } from 'react';
import Row from './components/Row';

export type RowData = Object;

export type ItemsDataType = Array<RowData>;

export type SyncItemsData = void | ItemsDataType;

export type AsyncItemsData = Promise<SyncItemsData>;

export type ItemsProvider = (Object | void) => SyncItemsData | AsyncItemsData;

export type RenderFunction = Object => Element<typeof Row>;

export type CSSWidth = string | number;
