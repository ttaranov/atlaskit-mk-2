// @flow
import { type Node, type Element } from 'react';

export type RowCellType = {
  key?: string | number,
  content: Node,
};

export type StatelessProps = {
  caption?: Node,
  head?: HeadType,
  rows?: Array<RowType>,
  // flowlint-next-line unclear-type:off
  emptyView?: Element<any>,
  loadingSpinnerSize?: LoadingSpinnerSizeType,
  isLoading?: boolean,
  isFixedSize?: boolean,
  rowsPerPage?: number,
  // flowlint-next-line unclear-type:off
  onSetPage: Function,
  // flowlint-next-line unclear-type:off
  onSort: Function,
  page?: number,
  sortKey?: string,
  sortOrder?: SortOrderType,
  isRankable?: boolean,
  isRankingDisabled?: boolean,
  onRankStart?: RankStart => void,
  onRankEnd?: RankEnd => void,
};

export type RowType = {
  cells: Array<RowCellType>,
  key?: string,
};

export type SortOrderType = 'ASC' | 'DESC';

export type SpinnerSizeType = 'small' | 'medium' | 'large' | 'xlarge';

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
