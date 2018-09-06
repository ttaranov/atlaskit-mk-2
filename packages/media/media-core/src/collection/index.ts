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

export type CollectionCache = {
  [collectionName: string]: {
    items: MediaCollectionItem[];
    subject: ReplaySubject<MediaCollectionItem[]>;
    isLoadingNextPage: boolean;
    nextInclusiveStartKey?: string;
  };
};

const mergeItems = (
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

const cache: CollectionCache = {};

export class CollectionFetcher {
  constructor(readonly mediaStore: MediaStore) {}

  private createFileStateObserver(
    id: string,
    details: MediaCollectionItemFullDetails,
  ): Observable<FileState> {
    const fileStream = new Observable<FileState>(observer => {
      const mediaFile: MediaFile = {
        id,
        ...details,
      };
      const fileState = mapMediaFileToFileState({ data: mediaFile });

      observer.next(fileState);
    }).publishReplay(1);

    fileStream.connect();

    return fileStream;
  }

  private populateCache(items: MediaCollectionItem[]) {
    const keyOptions = { collectionName: 'recents' };

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
    if (!cache[collectionName]) {
      cache[collectionName] = {
        items: [],
        subject: new ReplaySubject<MediaCollectionItem[]>(1),
        isLoadingNextPage: false,
      };
    }
    const collection = cache[collectionName];
    const subject = collection.subject;

    this.mediaStore
      .getCollectionItems(collectionName, {
        ...params,
        details: 'full',
      })
      .then(items => {
        const { contents, nextInclusiveStartKey } = items.data;
        this.populateCache(contents);

        collection.items = mergeItems(items.data.contents, collection.items);

        // We only want to asign nextInclusiveStartKey the first time
        if (!collection.nextInclusiveStartKey) {
          collection.nextInclusiveStartKey = nextInclusiveStartKey;
        }

        subject.next(collection.items);
      });

    return subject;
  }

  // TODO: check if we are already loading the next page for the given collectionName
  // TODO: we need to maintain at least the same limit (pageSize) we used previously
  async loadNextPage(collectionName: string) {
    const collection = cache[collectionName];
    const isLoading = collection ? collection.isLoadingNextPage : false;

    if (!collection || isLoading) {
      return;
    }

    collection.isLoadingNextPage = true;

    const {
      nextInclusiveStartKey: inclusiveStartKey,
      items: currentItems,
      subject,
    } = cache[collectionName];
    const response = await this.mediaStore.getCollectionItems(collectionName, {
      inclusiveStartKey,
      details: 'full',
    });
    const { contents, nextInclusiveStartKey } = response.data;
    this.populateCache(contents);
    const newItems = response.data.contents;
    const items = [...currentItems, ...newItems];

    subject.next(items);

    cache[collectionName] = {
      items,
      nextInclusiveStartKey,
      subject,
      isLoadingNextPage: false,
    };
  }
}
