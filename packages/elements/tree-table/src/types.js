// @flow
import { type Element } from 'react';
import RowDataComponent from './components/RowData';

export type RowData = Object;

export type DataFunction = (
  ?Object,
) => ?Array<RowData> | Promise<?Array<RowData>>;

export type RenderFunction = Object => Element<typeof RowDataComponent>;

export type CSSWidth = string | number;
