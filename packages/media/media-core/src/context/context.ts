import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
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
import { MediaLinkService } from '../services/linkService';
import { LRUCache } from 'lru-fast';
import { DEFAULT_COLLECTION_PAGE_SIZE } from '../services/collectionService';
import { ContextConfig, MediaApiConfig } from '../auth';
import { FileItem } from '../item';

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

  addLinkItem(
    url: string,
    collectionName: string,
    metadata?: UrlPreview,
  ): Promise<string>;

  refreshCollection(collectionName: string, pageSize: number): void;

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

  constructor(readonly config: ContextConfig) {
    this.fileItemCache = new LRUCache<string, FileItem>(
      config.cacheSize || DEFAULT_CACHE_SIZE,
    );
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
