import { Observable } from 'rxjs/Observable';

import { of } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';

import {
  MediaStore,
  UploadableFile,
  ContextConfig,
  MediaApiConfig,
  UploadController,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from '@atlaskit/media-store';
import { CollectionFetcher } from '../collection';
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
import { GetFileOptions, FileState } from '../fileState';
import { FileFetcher } from '../file';

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

  // TODO Next two methods are deprecated and will be removed with next major release.
  // Please use .file.getFile and .file.uploadFile APIs
  getFile(id: string, options?: GetFileOptions): Observable<FileState>;
  uploadFile(
    file: UploadableFile,
    controller?: UploadController,
  ): Observable<FileState>;

  getImage(id: string, params?: MediaStoreGetFileImageParams): Promise<Blob>;
  getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<ImageMetadata>;

  readonly collection: CollectionFetcher;
  readonly file: FileFetcher;
  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new ContextImpl(config);
  }
}

class ContextImpl implements Context {
  private readonly collectionPool = RemoteMediaCollectionProviderFactory.createPool();
  private readonly itemPool = MediaItemProvider.createPool();
  private readonly urlPreviewPool = MediaUrlPreviewProvider.createPool();
  private readonly fileItemCache: LRUCache<string, FileItem>;
  private readonly localPreviewCache: LRUCache<string, string>;
  private readonly mediaStore: MediaStore;
  readonly collection: CollectionFetcher;
  readonly file: FileFetcher;

  constructor(readonly config: ContextConfig) {
    this.fileItemCache = new LRUCache(config.cacheSize || DEFAULT_CACHE_SIZE);
    this.localPreviewCache = new LRUCache(10);
    this.mediaStore = new MediaStore({
      authProvider: config.authProvider,
    });
    this.collection = new CollectionFetcher(this.mediaStore);
    this.file = new FileFetcher(this.mediaStore);
  }

  getFile(id: string, options?: GetFileOptions): Observable<FileState> {
    /* tslint:disable-next-line:no-console */
    console.warn(
      'context.getFile is deprecated. Please use context.file.getFileState instead',
    );
    return this.file.getFileState(id, options);
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
    /* tslint:disable-next-line:no-console */
    console.warn(
      'context.uploadFile is deprecated. Please use context.file.upload instead',
    );
    return this.file.upload(file, controller);
  }

  refreshCollection(collectionName: string, pageSize: number): void {
    this.getMediaCollectionProvider(collectionName, pageSize).refresh();
  }

  getImage(id: string, params?: MediaStoreGetFileImageParams): Promise<Blob> {
    return this.mediaStore.getImage(id, params);
  }

  async getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<ImageMetadata> {
    return (await this.mediaStore.getImageMetadata(id, params)).metadata;
  }

  private get apiConfig(): MediaApiConfig {
    return {
      authProvider: this.config.authProvider,
    };
  }
}
