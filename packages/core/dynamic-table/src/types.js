// @flow
import { type Node, type Element } from 'react';

export type RowCellType = {
  key?: string | number,
  content: Node,
};

type i18nShape = {
  prev: string,
  next: string,
};

export type StatelessProps = {
  caption?: Node,
  head?: HeadType,
  rows?: Array<RowType>,
  emptyView?: Element<any>,
  loadingSpinnerSize?: LoadingSpinnerSizeType,
  isLoading?: boolean,
  isFixedSize?: boolean,
  rowsPerPage?: number,
  onSetPage: Function,
  onSort: Function,
  page?: number,
  sortKey?: string,
  sortOrder?: SortOrderType,
  isRankable?: boolean,
  isRankingDisabled?: boolean,
  onRankStart?: RankStart => void,
  onRankEnd?: RankEnd => void,
  paginationi18n?: i18nShape,
};

export type RowType = {
  cells: Array<RowCellType>,
  key?: string,
};

export type SortOrderType = 'ASC' | 'DESC';

export type SpinnerSizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

export type LoadingSpinnerSizeType = 'small' | 'large';

export type HeadCellType = {
  ...RowCellType,
  isSortable?: boolean,
  width?: number,
  shouldTruncate?: boolean,
};

export type RankEndLocation = {
  index: number, // index on current page
  afterKey?: string,
  beforeKey?: string,
};

export type RankEnd = {
  sourceIndex: number,
  sourceKey: string,
  destination?: RankEndLocation,
};

export type RankStart = {
  index: number,
  key: string,
};

export type HeadType = { cells: Array<HeadCellType> };
