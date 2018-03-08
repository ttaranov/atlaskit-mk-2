// mutate RxJS Observable with required methods
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { MouseEvent } from 'react';
import {
  CardAction,
  MediaItemDetails,
  MediaCollectionItem,
  MediaType,
  FileProcessingStatus,
} from '@atlaskit/media-core';
import { UIAnalyticsEvent } from './analytics-next-types';

// the only components we expose to consumers is Card, CardView and CardList
export * from './root/card';
export * from './root/cardView';
export * from './list';
// TODO: don't expose this directly https://jira.atlassian.com/browse/FIL-4396
export { AppCardView } from './app_2/AppCardViewV2';

export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
  | 'complete'
  | 'error';

export type CardAppearance =
  | 'auto'
  | 'small'
  | 'image'
  | 'square'
  | 'horizontal';

export type CardDimensionValue = number | string;

export interface CardDimensions {
  width?: CardDimensionValue;
  height?: CardDimensionValue;
}

export interface CardEvent {
  event: MouseEvent<HTMLElement>;
  mediaItemDetails?: MediaItemDetails;
}

export interface CardListEvent {
  event: MouseEvent<HTMLElement>;
  collectionName: string;
  mediaCollectionItem: MediaCollectionItem;
}

export interface OnSelectChangeFuncResult {
  selected: boolean;
  mediaItemDetails?: MediaItemDetails;
}

export interface OnSelectChangeFunc {
  (result: OnSelectChangeFuncResult): void;
}

export interface OnLoadingChangeState {
  readonly type: CardStatus;
  readonly payload?: Error | MediaItemDetails;
}

export interface OnLoadingChangeFunc {
  (state: OnLoadingChangeState): void;
}

export interface SharedCardProps {
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;

  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
}

export interface CardEventProps {
  readonly onClick?: (
    result: CardEvent,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: OnSelectChangeFunc;
  readonly onLoadingChange?: OnLoadingChangeFunc;
}

export interface AnalyticsFileAttributes {
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileStatus?: FileProcessingStatus;
  fileSize?: number;
}

export interface AnalyticsLinkAttributes {
  linkDomain: string;
}

export interface AnalyticsViewAttributes {
  viewPreview: boolean;
  viewActionmenu: boolean;
  viewSize?: CardAppearance;
}

export interface CardViewAnalyticsContext {
  // These fields are requested to be in all UI events. See guidelines:
  // https://extranet.atlassian.com/display/PData/UI+Events
  packageVersion: string; // string — in a format like '3.2.1'
  packageName: string;
  componentName: string;

  actionSubject: string; // MediaCard
  actionSubjectId: string | null; // file/link id
  loadStatus: 'fail' | 'loading_metadata' | 'uploading' | 'complete';
  type: 'file' | 'link' | 'smart';
  viewAttributes: AnalyticsViewAttributes;
  fileAttributes?: AnalyticsFileAttributes;
  linkAttributes?: AnalyticsLinkAttributes;
}
