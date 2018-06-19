import * as uuid from 'uuid';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/publishReplay';

import {
  MediaStore,
  uploadFile,
  UploadableFile,
  ContextConfig,
  MediaApiConfig,
} from '@atlaskit/media-store';

import {
  MediaItemProvider,
  MediaCollectionProvider,
  MediaUrlPreviewProvider,
} from '../providers/';
import { RemoteMediaCollectionProviderFactory } from '../providers/remoteMediaCollectionProviderFactory';
import { MediaItemType, MediaItem, UrlPreview } from '../';
import {
  MediaDataUriService,
  DataUriService,
} from '../services/dataUriService';
import { BlobService, MediaBlobService } from '../services/blobService';
import { MediaLinkService } from '../services/linkService';
import { LRUCache } from 'lru-fast';
import { DEFAULT_COLLECTION_PAGE_SIZE } from '../services/collectionService';
import { FileItem } from '../item';
import {
  GetFileOptions,
  FileState,
  mapMediaFileToFileState,
} from '../fileState';
import { Observer } from 'rxjs/Observer';
import FileStreamCache from './fileStreamCache';

const DEFAULT_CACHE_SIZE = 200;

export interface Context {
  getMediaItemProvider(
    id: string,
    mediaItemType: MediaItemType,
    collectionName?: string,
    mediaItem?: MediaItem,
  ): MediaItemProvider;

  getMediaCollectionProvider(
    collectionName: string,
    pageSize: number,
  ): MediaCollectionProvider;

  getUrlPreviewProvider(url: string): MediaUrlPreviewProvider;

  getDataUriService(collectionName?: string): DataUriService;

  getLocalPreview(id: string): string | undefined;

  setLocalPreview(id: string, preview: string): void;

  removeLocalPreview(id: string): void;

  getBlobService(collectionName?: string): BlobService;

  addLinkItem(
    url: string,
    collectionName: string,
    metadata?: UrlPreview,
  ): Promise<string>;

  refreshCollection(collectionName: string, pageSize: number): void;

  getFile(id: string, options?: GetFileOptions): Observable<FileState>;
  uploadFile(file: UploadableFile): Observable<FileState>;

  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new ContextImpl(config);
  }
}

const pollingInterval = 1000;

class ContextImpl implements Context {
  private readonly collectionPool = RemoteMediaCollectionProviderFactory.createPool();
  private readonly itemPool = MediaItemProvider.createPool();
  private readonly urlPreviewPool = MediaUrlPreviewProvider.createPool();
  private readonly fileItemCache: LRUCache<string, FileItem>;
  private readonly localPreviewCache: LRUCache<string, string>;
  private readonly fileStreamsCache: FileStreamCache;
  private readonly mediaStore: MediaStore;

  constructor(readonly config: ContextConfig) {
    this.fileItemCache = new LRUCache(config.cacheSize || DEFAULT_CACHE_SIZE);
    this.localPreviewCache = new LRUCache(10);
    this.fileStreamsCache = new FileStreamCache();
    this.mediaStore = new MediaStore({
      serviceHost: config.serviceHost,
      authProvider: config.authProvider,
    });
  }

  getFile(id: string, options?: GetFileOptions): Observable<FileState> {
    const key = FileStreamCache.createKey(id, options);

    return this.fileStreamsCache.getOrInsert(key, () => {
      const collection = options && options.collectionName;
      const fileStream$ = this.createDownloadFileStream(
        id,
        collection,
      ).publishReplay(1);

      fileStream$.connect();

      return fileStream$;
    });
  }

  private createDownloadFileStream = (
    id: string,
    collection?: string,
  ): Observable<FileState> => {
    return Observable.create(async (observer: Observer<FileState>) => {
      let timeoutId: number;

      const fetchFile = async () => {
        try {
          const response = await this.mediaStore.getFile(id, { collection });
          const fileState = mapMediaFileToFileState(response);

          observer.next(fileState);

          if (fileState.status === 'processing') {
            timeoutId = window.setTimeout(fetchFile, pollingInterval);
          } else {
            observer.complete();
          }
        } catch (e) {
          observer.error(e);
        }
      };

      fetchFile();

      return () => {
        window.clearTimeout(timeoutId);
      };
    });
  };

  getMediaItemProvider(
    id: string,
    mediaItemType: MediaItemType,
    collectionName?: string,
    mediaItem?: MediaItem,
  ): MediaItemProvider {
    const isMediaItemLink = mediaItem && mediaItem.type === 'link';
    const isMediaItemFileAndNotPending =
      mediaItem &&
      mediaItem.type === 'file' &&
      mediaItem.details.processingStatus !== 'pending';

    if (mediaItem && (isMediaItemLink || isMediaItemFileAndNotPending)) {
      return {
        observable() {
          return Observable.of(mediaItem);
        },
      };
    }

    const provider = MediaItemProvider.fromPool(
      this.itemPool,
      this.apiConfig,
      this.fileItemCache,
      mediaItemType,
      id,
      collectionName,
    );

    if (mediaItem) {
      return {
        observable() {
          return provider.observable().startWith(mediaItem);
        },
      };
    }

    return provider;
  }

  getMediaCollectionProvider(
    collectionName: string,
    pageSize: number = DEFAULT_COLLECTION_PAGE_SIZE,
  ): MediaCollectionProvider {
    return RemoteMediaCollectionProviderFactory.fromPool(
      this.collectionPool,
      this.apiConfig,
      collectionName,
      pageSize,
    );
  }

  getDataUriService(collectionName?: string): DataUriService {
    return new MediaDataUriService(
      this.config.authProvider,
      this.config.serviceHost,
      collectionName,
    );
  }

  setLocalPreview(id: string, preview: string) {
    this.localPreviewCache.set(id, preview);
  }

  getLocalPreview(id: string): string | undefined {
    return this.localPreviewCache.get(id);
  }

  removeLocalPreview(id: string) {
    this.localPreviewCache.remove(id);
  }

  getBlobService(collectionName?: string): BlobService {
    return new MediaBlobService(
      this.config.authProvider,
      this.config.serviceHost,
      collectionName,
    );
  }

  getUrlPreviewProvider(url: string): MediaUrlPreviewProvider {
    return MediaUrlPreviewProvider.fromPool(
      this.urlPreviewPool,
      this.apiConfig,
      url,
    );
  }

  addLinkItem(
    url: string,
    collectionName: string,
    metadata?: UrlPreview,
  ): Promise<string> {
    const linkService = new MediaLinkService(this.apiConfig);
    return linkService.addLinkItem(url, collectionName, metadata);
  }

  uploadFile(file: UploadableFile): Observable<FileState> {
    let id: string;
    // TODO: we can't get the size from a file when is string, make media-store + Chunkinator to pass this info?
    const size = file.content instanceof Blob ? file.content.size : 0;
    const tempFileId = uuid.v4();
    const fileStream = new Observable<FileState>(observer => {
      try {
        const name = file.name || '';
        // TODO send local preview
        const { deferredFileId, cancel } = uploadFile(file, this.apiConfig, {
          onProgress: progress => {
            observer.next({
              id: tempFileId,
              progress,
              status: 'uploading',
              name,
              size,
            });
          },
        });

        deferredFileId.then(id => {
          // we create a new entry in the cache with the same stream to make the temp/public id mapping to work
          // TODO: add test for this case
          this.fileStreamsCache.set(id, fileStream);
          observer.next({
            id,
            progress: 1,
            status: 'uploading',
            name,
            size,
          });
          observer.complete();
        });
        // return cancel;
        // return () => {
        //   console.log('cancel cleanup');
        //   cancel();
        // }
      } catch (e) {
        observer.error(e);
        return () => {};
      }
    })
      .concat(Observable.defer(() => this.createDownloadFileStream(id)))
      .publishReplay(1);
    // .refCount()

    this.fileStreamsCache.set(tempFileId, fileStream);
    // Start hot observable
    fileStream.connect();

    return fileStream;
  }

  refreshCollection(collectionName: string, pageSize: number): void {
    this.getMediaCollectionProvider(collectionName, pageSize).refresh();
  }

  private get apiConfig(): MediaApiConfig {
    return {
      serviceHost: this.config.serviceHost,
      authProvider: this.config.authProvider,
    };
  }
}
