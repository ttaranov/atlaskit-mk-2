import { FileItem, FileDetails, LinkItem, LinkDetails } from './item';

export interface MediaCollectionFileItemDetails extends FileDetails {
  occurrenceKey: string;
}

export interface MediaCollectionFileItem extends FileItem {
  insertedAt: number;
  details: MediaCollectionFileItemDetails;
}

export interface MediaCollectionLinkItemDetails extends LinkDetails {
  occurrenceKey: string;
}

export interface MediaCollectionLinkItem extends LinkItem {
  insertedAt: number;
  details: MediaCollectionLinkItemDetails;
}

export type MediaCollectionItem =
  | MediaCollectionFileItem
  | MediaCollectionLinkItem;

export interface MediaCollection {
  id: string;
  items: Array<MediaCollectionItem>;
}
