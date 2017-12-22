// @flow
import { type Element } from 'react';
import Row from './components/Row';

export type RowData = Object;

export type DataFunction = (
  ?Object,
) => ?Array<RowData> | Promise<?Array<RowData>>;

export type RenderFunction = Object => Element<typeof Row>;

export type CSSWidth = string | number;
