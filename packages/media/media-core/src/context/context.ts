import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { Subscriber } from 'rxjs/Subscriber';
import { defer } from 'rxjs/observable/defer';
import { concat } from 'rxjs/operators/concat';
import { refCount } from 'rxjs/operators/refCount';
import { startWith } from 'rxjs/operators/startWith';
import { publishReplay } from 'rxjs/operators/publishReplay';

import {
  MediaStore,
  uploadFile,
  UploadableFile,
  ContextConfig,
  MediaApiConfig,
  UploadController,
  MediaStoreGetFileImageParams,
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
import FileStreamCache, { fileStreamsCache } from './fileStreamCache';
import { getMediaTypeFromUploadableFile } from '../utils/getMediaTypeFromUploadableFile';

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
  uploadFile(
    file: UploadableFile,
    controller?: UploadController,
  ): Observable<FileState>;

  getImage(id: string, params?: MediaStoreGetFileImageParams): Promise<Blob>;

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
  private readonly mediaStore: MediaStore;

  constructor(readonly config: ContextConfig) {
    this.fileItemCache = new LRUCache(config.cacheSize || DEFAULT_CACHE_SIZE);
    this.localPreviewCache = new LRUCache(10);
    this.mediaStore = new MediaStore({
      authProvider: config.authProvider,
    });
  }

  getFile(id: string, options?: GetFileOptions): Observable<FileState> {
    const key = FileStreamCache.createKey(id, options);

    return fileStreamsCache.getOrInsert(key, () => {
      const collection = options && options.collectionName;
      const fileStream$ = publishReplay<FileState>(1)(
        this.createDownloadFileStream(id, collection),
      );

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
          return of(mediaItem);
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
          return provider.observable().pipe(startWith(mediaItem));
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
    return new MediaDataUriService(this.config.authProvider, collectionName);
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
    return new MediaBlobService(this.config.authProvider, collectionName);
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

  uploadFile(
    file: UploadableFile,
    controller?: UploadController,
  ): Observable<FileState> {
    let fileId: string;
    let mimeType = '';
    // TODO [MSW-796]: get file size for base64
    const size = file.content instanceof Blob ? file.content.size : 0;
    const mediaType = getMediaTypeFromUploadableFile(file);
    const collectionName = file.collection;
    const name = file.name || ''; // name property is not available in base64 image
    const fileStreamSubscribe = (observer: Subscriber<FileState>) => {
      if (file.content instanceof Blob) {
        mimeType = file.content.type;
      }

      const { deferredFileId, cancel } = uploadFile(file, this.apiConfig, {
        onProgress: progress => {
          if (fileId) {
            observer.next({
              progress,
              name,
              size,
              mediaType,
              mimeType,
              id: fileId,
              status: 'uploading',
            });
          }
        },
        onId: id => {
          fileId = id;
          const key = FileStreamCache.createKey(fileId, { collectionName });
          fileStreamsCache.set(key, fileStream);
          if (file.content instanceof Blob) {
            observer.next({
              name,
              size,
              mediaType,
              mimeType,
              id: fileId,
              progress: 0,
              status: 'uploading',
              preview: {
                blob: file.content,
              },
            });
          }
        },
      });

      if (controller) {
        controller.setAbort(cancel);
      }

      deferredFileId
        .then(() => {
          observer.next({
            id: fileId,
            name,
            size,
            mediaType,
            mimeType,
            status: 'processing',
          });
          observer.complete();
        })
        .catch(error => {
          // we can't use .catch(observer.error) due that will change the Subscriber context
          observer.error(error);
        });
    };

    const fileStream = new Observable<FileState>(fileStreamSubscribe).pipe(
      concat(
        defer(() => this.createDownloadFileStream(fileId, collectionName)),
      ),
      publishReplay(1),
      refCount(),
    );

    return fileStream;
  }

  refreshCollection(collectionName: string, pageSize: number): void {
    this.getMediaCollectionProvider(collectionName, pageSize).refresh();
  }

  getImage(id: string, params?: MediaStoreGetFileImageParams): Promise<Blob> {
    return this.mediaStore.getImage(id, params);
  }

  private get apiConfig(): MediaApiConfig {
    return {
      authProvider: this.config.authProvider,
    };
  }
}
