import {
  MediaStore,
  MediaStoreGetCollectionItemsParams,
  MediaCollectionItem,
  MediaCollectionItemFullDetails,
  MediaFile,
} from '@atlaskit/media-store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FileItem, FileDetails, LinkItem, LinkDetails } from '../item';
import { FileState, mapMediaFileToFileState } from '../fileState';
import { FileStreamCache, fileStreamsCache } from '../context/fileStreamCache';

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

export interface MediaCollection {
  id: string;
  items: Array<MediaCollectionItem>;
}

export interface CollectionCacheEntry {
  items: MediaCollectionItem[];
  subject: ReplaySubject<MediaCollectionItem[]>;
  isLoadingNextPage: boolean;
  nextInclusiveStartKey?: string;
}
export type CollectionCache = {
  [collectionName: string]: CollectionCacheEntry;
};

export const mergeItems = (
  firstPageItems: MediaCollectionItem[],
  currentItems: MediaCollectionItem[],
): MediaCollectionItem[] => {
  let reachedFirst = false;
  const firstId = currentItems[0] ? currentItems[0].id : '';
  const newItems = firstPageItems.filter(item => {
    if (reachedFirst) {
      return false;
    }
    reachedFirst = firstId === item.id;
    return !reachedFirst;
  });

  return [...newItems, ...currentItems];
};

export const collectionCache: CollectionCache = {};

const createCacheEntry = (): CollectionCacheEntry => ({
  items: [],
  subject: new ReplaySubject<MediaCollectionItem[]>(1),
  isLoadingNextPage: false,
});

export class CollectionFetcher {
  constructor(readonly mediaStore: MediaStore) {}

  private createFileStateObserver(
    id: string,
    details: MediaCollectionItemFullDetails,
  ): Observable<FileState> {
    const subject = new ReplaySubject<FileState>(1);
    const mediaFile: MediaFile = {
      id,
      ...details,
    };
    const fileState = mapMediaFileToFileState({ data: mediaFile });

    subject.next(fileState);

    return subject;
  }

  private populateCache(items: MediaCollectionItem[], collectionName: string) {
    const keyOptions = { collectionName };

    items.forEach(item => {
      const key = FileStreamCache.createKey(item.id, keyOptions);
      const fileStream = this.createFileStateObserver(
        item.id,
        item.details as MediaCollectionItemFullDetails,
      );

      fileStreamsCache.set(key, fileStream);
    });
  }

  getItems(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
  ): Observable<MediaCollectionItem[]> {
    if (!collectionCache[collectionName]) {
      collectionCache[collectionName] = createCacheEntry();
    }
    const collection = collectionCache[collectionName];
    const subject = collection.subject;

    this.mediaStore
      .getCollectionItems(collectionName, {
        ...params,
        details: 'full',
      })
      .then(items => {
        const { contents, nextInclusiveStartKey } = items.data;

        this.populateCache(contents, collectionName);
        collection.items = mergeItems(items.data.contents, collection.items);

        // We only want to asign nextInclusiveStartKey the first time
        if (!collection.nextInclusiveStartKey) {
          collection.nextInclusiveStartKey = nextInclusiveStartKey;
        }

        subject.next(collection.items);
      });

    return subject;
  }

  async loadNextPage(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
  ) {
    const collection = collectionCache[collectionName];
    const isLoading = collection ? collection.isLoadingNextPage : false;

    if (!collection || !collection.nextInclusiveStartKey || isLoading) {
      return;
    }

    collection.isLoadingNextPage = true;

    const {
      nextInclusiveStartKey: inclusiveStartKey,
      items: currentItems,
      subject,
    } = collectionCache[collectionName];
    const response = await this.mediaStore.getCollectionItems(collectionName, {
      ...params,
      inclusiveStartKey,
      details: 'full',
    });
    const { contents, nextInclusiveStartKey } = response.data;
    this.populateCache(contents, collectionName);
    const newItems = response.data.contents;
    const items = [...currentItems, ...newItems];

    subject.next(items);

    collectionCache[collectionName] = {
      items,
      nextInclusiveStartKey,
      subject,
      isLoadingNextPage: false,
    };
  }
}
