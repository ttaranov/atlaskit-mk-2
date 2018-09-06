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

// export type MediaCollectionItem =
//   | MediaCollectionFileItem
//   | MediaCollectionLinkItem;

export interface MediaCollection {
  id: string;
  items: Array<MediaCollectionItem>;
}

export type CollectionCache = {
  [collectionName: string]: {
    ids: string[];
    subject: ReplaySubject<string[]>;
    isLoadingNextPage: boolean;
    nextInclusiveStartKey?: string;
  };
};

const mergeIds = (firstPageIds: string[], currentIds: string[]): string[] => {
  let reachedFirst = false;
  const firstId = currentIds[0];
  const newIds = firstPageIds.filter(id => {
    if (reachedFirst) {
      return false;
    }
    reachedFirst = firstId === id;
    return !reachedFirst;
  });

  return [...newIds, ...currentIds];
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
  ): Observable<string[]> {
    if (!cache[collectionName]) {
      cache[collectionName] = {
        ids: [],
        subject: new ReplaySubject<string[]>(1),
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
        const newIds = contents.map(item => item.id);

        collection.ids = mergeIds(newIds, collection.ids);

        // We only want to asign nextInclusiveStartKey the first time
        if (!collection.nextInclusiveStartKey) {
          collection.nextInclusiveStartKey = nextInclusiveStartKey;
        }

        subject.next(collection.ids);
      });

    return subject;
  }

  async loadNextPage(collectionName: string) {
    const collection = cache[collectionName];
    const isLoading = collection ? collection.isLoadingNextPage : false;

    if (!collection || isLoading) {
      return;
    }

    collection.isLoadingNextPage = true;

    const {
      nextInclusiveStartKey: inclusiveStartKey,
      ids: currentIds,
      subject,
    } = cache[collectionName];
    const items = await this.mediaStore.getCollectionItems(collectionName, {
      inclusiveStartKey,
      details: 'full',
    });
    const { contents, nextInclusiveStartKey } = items.data;
    this.populateCache(contents);
    const newIds = contents.map(item => item.id);
    const ids = [...currentIds, ...newIds];

    subject.next(ids);

    cache[collectionName] = {
      ids,
      nextInclusiveStartKey,
      subject,
      isLoadingNextPage: false,
    };
  }
}
