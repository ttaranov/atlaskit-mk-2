// @flow
import { type Node, type Element } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type RowCellType = {
  key?: string | number,
  content: Node,
};

type SortObj = {
  key: string | number | null,
  sortOrder?: SortOrderType | null,
  item: RowCellType,
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
  /** Handler called when table page changes. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onSetPage: (page: number, analyticsEvent?: UIAnalyticsEvent) => void,
  /** Handler called when table sort changes. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onSort: (SortObj, analyticsEvent?: UIAnalyticsEvent) => void,
  page?: number,
  sortKey?: string,
  sortOrder?: SortOrderType,
  isRankable?: boolean,
  isRankingDisabled?: boolean,
  /** Handler called when table row reordering begins. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onRankStart?: (RankStart, analyticsEvent?: UIAnalyticsEvent) => void,
  /** Handler called when table row reordering ends. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details.  */
  onRankEnd?: (RankEnd, analyticsEvent?: UIAnalyticsEvent) => void,
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
