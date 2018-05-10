import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/concat';

// import {publishReplay} from 'rxjs/operator/publishReplay';
import {
  ContextConfig,
  MediaApiConfig,
  MediaStore,
  MediaFileProcessingStatus,
  MediaFile,
  MediaStoreResponse,
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
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

const DEFAULT_CACHE_SIZE = 200;

export type FileStatus = 'uploading' | 'processing' | 'processed' | 'error';
export interface FilePreview {
  blob: Blob;
  originalDimensions?: {
    width: number;
    height: number;
  };
}
export interface PreviewOptions {}
export interface GetFileOptions {
  preview?: PreviewOptions;
  collectionName?: string;
}
export interface UploadingFileState {
  status: 'uploading';
  id: string;
  name: string;
  size: number;
  progress: number;
  preview?: FilePreview;
}
export interface ProcessingFileState {
  status: 'processing';
  id: string;
  name: string;
  size: number;
  preview?: FilePreview;
}
export interface ProcessedFileState {
  status: 'processed';
  id: string;
  name: string;
  size: number;
  artifacts: Object;
  // mediaType: MediaType;
  binaryUrl: string;
  preview?: FilePreview;
}
export interface ErrorFileState {
  status: 'error';
  id: string;
}
export type FileState =
  | UploadingFileState
  | ProcessingFileState
  | ProcessedFileState
  | ErrorFileState;

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
  uploadFile(): Observable<FileState>;

  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new ContextImpl(config);
  }
}

const apiFileStatusToFileStatus = (
  fileStatus: MediaFileProcessingStatus,
): FileStatus => {
  switch (fileStatus) {
    case 'pending':
      return 'processing';
    case 'succeeded':
    case 'failed':
      return 'processed';
  }
};

const mapMediaFileToFileState = (
  mediaFile: MediaStoreResponse<MediaFile>,
): FileState => {
  return {
    status: apiFileStatusToFileStatus(mediaFile.data.processingStatus),
    id: mediaFile.data.id,
    name: mediaFile.data.name,
    size: mediaFile.data.size,
  } as ProcessedFileState | ProcessingFileState;
};

class ContextImpl implements Context {
  private readonly collectionPool = RemoteMediaCollectionProviderFactory.createPool();
  private readonly itemPool = MediaItemProvider.createPool();
  private readonly urlPreviewPool = MediaUrlPreviewProvider.createPool();
  private readonly fileItemCache: LRUCache<string, FileItem>;
  private readonly localPreviewCache: LRUCache<string, string>;
  private readonly fileStreams: Map<string, ConnectableObservable<FileState>>;
  private readonly mediaStore: MediaStore;

  constructor(readonly config: ContextConfig) {
    this.fileItemCache = new LRUCache(config.cacheSize || DEFAULT_CACHE_SIZE);
    this.localPreviewCache = new LRUCache(10);
    this.fileStreams = new Map();
    this.mediaStore = new MediaStore({
      serviceHost: config.serviceHost,
      authProvider: config.authProvider,
    });
  }

  getFile(id: string, options?: GetFileOptions): Observable<FileState> {
    const collectionName =
      options && options.collectionName ? `-${options.collectionName}` : '';
    const key = `${id}${collectionName}`;
    const fileStream = this.fileStreams.get(key);

    if (!fileStream) {
      const stream = Observable.timer(0, 1000)
        .switchMap(() => {
          return this.mediaStore.getFile(id);
        })
        .map(mapMediaFileToFileState)
        .takeWhile(file => file.status === 'processing')
        .concat(
          Observable.defer(() => {
            // TODO: this will make an extra request, investigate how to fix it
            return this.mediaStore.getFile(id);
          }),
        )
        .map(mapMediaFileToFileState)
        .publishLast();

      stream.connect();

      this.fileStreams.set(key, stream);
    }

    return this.fileStreams.get(key)!;
  }

  // TODO: This is fake
  uploadFile(): Observable<FileState> {
    const fileId = `${new Date().getTime()}`;
    const stream = new Observable<FileState>(subscription => {
      let progress = 0;

      subscription.next({
        id: fileId,
        status: 'uploading',
      } as UploadingFileState);

      setInterval(() => {
        progress += 1;
        subscription.add;
        subscription.next({
          id: fileId,
          status: 'uploading',
          progress,
        } as UploadingFileState);
      }, 2000);
    }).publishReplay(1);

    stream.connect();

    this.fileStreams.set(fileId, stream);

    return stream;
  }

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
