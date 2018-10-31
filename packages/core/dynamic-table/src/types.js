// @flow
import { type Node, type Element } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

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
  /** Object describing the column headings */
  head?: HeadType,
  /** The data to render in the table */
  rows?: Array<RowType>,
  /** Component to render when there is no data */
  emptyView?: Element<any>,
  /** Controls the size of the rendered spinner */
  loadingSpinnerSize?: LoadingSpinnerSizeType,
  /** Whether to show the loading state or not */
  isLoading?: boolean,
  isFixedSize?: boolean,
  /** The maximum number of rows per page. No maximum by default. */
  rowsPerPage?: number,
  /** Called when the page changes. Provides an analytics event when the page change was from a click on pagination component. */
  onSetPage: (number, ?UIAnalyticsEvent) => any,
  /** Called when a column is sorted. Provides information about what was sorted and an analytics event. */
  onSort: (Object, ?UIAnalyticsEvent) => any,
  /** The current page number */
  page?: number,
  /** The property to sort items by */
  sortKey?: string,
  /** Whether to sort in ascending or descending order */
  sortOrder?: SortOrderType,
  isRankable?: boolean,
  isRankingDisabled?: boolean,
  onRankStart?: RankStart => void,
  onRankEnd?: (RankEnd, ?UIAnalyticsEvent) => void,
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
