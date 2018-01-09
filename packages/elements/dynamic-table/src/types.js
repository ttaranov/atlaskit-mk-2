// @flow
import { type Node, type Element } from 'react';
import { type DragStart as RankStart, type DropResult as RankEnd } from 'react-beautiful-dnd';

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
  isRankable?: boolean,
  onRankStart?: (RankStart) => void,
  onRankEnd?: (RankEnd) => void,
};

export type RowType = {
  cells: Array<RowCellType>,
  key?: string | number,
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

export type {RankStart, RankEnd};
