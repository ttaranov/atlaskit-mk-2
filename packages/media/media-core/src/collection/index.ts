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
    nextInclusiveStartKey?: string;
  };
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
    const collection = cache[collectionName];
    const subject = collection
      ? collection.subject
      : new ReplaySubject<string[]>(1);

    this.mediaStore
      .getCollectionItems(collectionName, {
        ...params,
        details: 'full',
      })
      .then(items => {
        const { contents, nextInclusiveStartKey } = items.data;
        this.populateCache(contents);
        const ids = contents.map(item => item.id);

        cache[collectionName] = {
          ids,
          nextInclusiveStartKey, // TODO: only set nextInclusiveStartKey if it was undefined
          subject,
        };

        subject.next(ids);
      });

    return subject;
  }

  // TODO: check if we are already loading the next page for the given collectionName
  async loadNextPage(collectionName: string) {
    const collection = cache[collectionName];
    if (!collection) {
      return;
    }

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
    };
  }
}
