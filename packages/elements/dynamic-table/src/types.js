// @flow
import { type Node } from 'react';

export type RowCellType = {
  key?: string | number,
  content: Node,
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
