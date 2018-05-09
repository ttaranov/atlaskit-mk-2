// @flow
import { type Element } from 'react';
import Row from './components/Row';

export type RowData = Object;

export type ItemsDataType = Array<RowData>;

export type LoadableItems = ?Array<RowData> | null;

export type RenderFunction = Object => Element<typeof Row>;

export type CSSWidth = string | number;
