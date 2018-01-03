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
};

export type RowType = {
  cells: Array<RowCellType>,
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

export type HeadType = { cells: Array<HeadCellType> };
