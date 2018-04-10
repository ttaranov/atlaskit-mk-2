import {
  MediaItem,
  MediaCollection,
  MediaCollectionItem,
} from '@atlaskit/media-core';
import { ReactNode } from 'react';

export interface CardAction {
  label?: string;
  handler: CardEventHandler;
  icon?: ReactNode;
}

export type CardEventHandler = (item?: MediaItem, event?: Event) => void;

export interface CollectionAction {
  label?: string;
  handler: CollectionEventHandler;
}

export type CollectionEventHandler = (
  item: MediaCollectionItem,
  collection: MediaCollection,
  event: Event,
) => void;
