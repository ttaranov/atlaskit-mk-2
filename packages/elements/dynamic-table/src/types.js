// @flow
import { type Node } from 'react';

export type RowCellType = {
  key?: any,
  content: Node,
};

export type RowType = {
  cells: Array<RowCellType>,
};

export type SortOrderType = 'ASC' | 'DESC';

export type SpinnerSizeType = 'small' | 'medium' | 'large' | 'xlarge';

export type LoadingSpinnerSizeType = 'small' | 'large';

export type HeadCellType = {
  isSortable?: boolean,
  width?: number,
  shouldTruncate?: boolean,
  key?: any,
  content?: Node,
};

export type HeadType = { cells: Array<HeadCellType> };
