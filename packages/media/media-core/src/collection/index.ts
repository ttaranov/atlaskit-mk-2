import {
  MediaStore,
  MediaStoreGetCollectionItemsParams,
} from '@atlaskit/media-store';
import { FileItem, FileDetails, LinkItem, LinkDetails } from '../item';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export interface MediaCollectionFileItemDetails extends FileDetails {
  occurrenceKey: string;
}

export interface MediaCollectionFileItem extends FileItem {
  details: MediaCollectionFileItemDetails;
}

export interface MediaCollectionLinkItemDetails extends LinkDetails {
  occurrenceKey: string;
}

export interface MediaCollectionLinkItem extends LinkItem {
  details: MediaCollectionLinkItemDetails;
}

export type MediaCollectionItem =
  | MediaCollectionFileItem
  | MediaCollectionLinkItem;

export interface MediaCollection {
  id: string;
  items: Array<MediaCollectionItem>;
}

export class CollectionFetcher {
  constructor(readonly mediaStore: MediaStore) {}

  getUserRecentItems(
    params?: MediaStoreGetCollectionItemsParams,
  ): Observable<string[]> {
    return Observable.create(async (observer: Observer<string[]>) => {
      const items = await this.mediaStore.getUserRecentItems(params);
      const ids = items.data.contents.map(item => item.id);

      observer.next(ids);
    });
    // return this.mediaStore.getCollectionItems(collectionName, params);
  }
}
