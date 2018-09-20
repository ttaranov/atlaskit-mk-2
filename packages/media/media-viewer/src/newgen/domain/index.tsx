import { MediaItemType } from '@atlaskit/media-core';

export { Outcome } from './outcome';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type ItemSource =
  | { kind: 'COLLECTION'; collectionName: string; pageSize: number }
  | { kind: 'ARRAY'; items: Identifier[] };

export type MediaViewerFeatureFlags = {
  customVideoPlayer?: boolean;
};
