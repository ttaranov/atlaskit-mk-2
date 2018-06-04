import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';

// import {publishReplay} from 'rxjs/operator/publishReplay';
import {
  MediaStore,
  MediaFileProcessingStatus,
  MediaFile,
  MediaStoreResponse,
  uploadFile,
  UploadableFile,
  UploadFileCallbacks,
  ContextConfig,
  MediaApiConfig,
  UploadFileResult,
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
  // uploadFile(file: UploadableFile): Observable<FileState>;
  uploadFile(
    file: UploadableFile,
    callbacks?: UploadFileCallbacks,
  ): UploadFileResult;

  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new ContextImpl(config);
  }
}

const apiProcessingStatusToFileStatus = (
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
  const { id, name, size, processingStatus } = mediaFile.data;

  return {
    status: apiProcessingStatusToFileStatus(processingStatus),
    id,
    name,
    size,
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
    const key = `${id}-${options && options.collectionName}`;

    if (this.fileStreams.has(key) === false) {
      const fileStream$ = this.createDownloadFileStream(id).publishReplay(1);
      // Start hot observable
      fileStream$.connect();

      this.fileStreams.set(key, fileStream$);
    }

    return this.fileStreams.get(key)!;
  }

  // uploadFile(file: UploadableFile): Observable<FileState> {
  //   let fileId: string | undefined;

  //   const fileStream = new Observable<FileState>(observer => {
  //     const name = file.name || '';
  //     let progress = 0;

  //     // TODO send local preview
  //     uploadFile(file, this.apiConfig, {
  //       onId: id => {
  //         fileId = id;
  //         this.fileStreams.set(fileId, fileStream);

  //         observer.next({
  //           id: fileId,
  //           status: 'uploading',
  //           progress,
  //           name,
  //           size: 0, // TODO: fix
  //         });
  //       },
  //       onProgress: uploadProgress => {
  //         progress = uploadProgress;

  //         if (fileId) {
  //           observer.next({
  //             id: fileId,
  //             progress,
  //             status: 'uploading',
  //             name,
  //             size: 0, // TODO: fix
  //           });
  //         }
  //       },
  //     })
  //       .then(id => {
  //         observer.next({
  //           id,
  //           progress: 1,
  //           status: 'uploading',
  //           name,
  //           size: 0, // TODO: fix
  //         });

  //         observer.complete();
  //       })
  //       .catch(err => observer.error(err));
  //   })
  //     .concat(
  //       Observable.defer(() => this.createDownloadFileStream(fileId as string)),
  //     )
  //     .publishReplay(1);

  //   // Start hot observable
  //   fileStream.connect();
  //   return fileStream;
  // }

  private createDownloadFileStream = (id: string) => {
    const requestFileStream$ = Observable.defer(() => {
      return this.mediaStore.getFile(id);
    }).map(mapMediaFileToFileState);

    const fileStream$ = Observable.timer(0, 3000)
      .switchMapTo(requestFileStream$)
      .takeWhile(file => file.status === 'processing')
      // TODO: concat will make an extra request, investigate how to fix it
      .concat(requestFileStream$);

    return fileStream$;
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

  uploadFile(
    file: UploadableFile,
    callbacks?: UploadFileCallbacks,
  ): UploadFileResult {
    return uploadFile(file, this.apiConfig, callbacks);
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
