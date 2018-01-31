import createRequest, { CreateRequestFunc } from './util/createRequest';
import { MediaItem } from '../';
import { AuthProvider } from '../auth';

export type DataUri = string;
export type ImageResizeMode = 'crop' | 'fit' | 'full-fit';
// TODO: make cache optional in the MediaDataUriService constructor to make it testeable
// TODO: use LRU cache ?

const cache = {};

export interface FetchImageOptions {
  width: number;
  height: number;
  mode?: ImageResizeMode;
  allowAnimated?: boolean;
}

export interface DataUriService {
  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri>;
  fetchImageDataUri(
    mediaItem: MediaItem,
    options: FetchImageOptions,
  ): Promise<DataUri>;
}

export class MediaDataUriService implements DataUriService {
  private request: CreateRequestFunc;

  constructor(
    private readonly authProvider: AuthProvider,
    private readonly serviceHost: string,
    private readonly collectionName?: string,
  ) {
    this.request = createRequest({
      config: {
        serviceHost: this.serviceHost,
        authProvider: this.authProvider,
      },
      collectionName: this.collectionName,
    });
  }

  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri> {
    return this.fetchSomeDataUri(`/file/${mediaItem.details.id}/binary`, {
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  async fetchImageDataUri(
    mediaItem: MediaItem,
    { width, height, mode = 'crop', allowAnimated = true }: FetchImageOptions,
  ): Promise<DataUri> {
    const id = mediaItem.details.id;
    const key = this.createCacheKey(
      id || '',
      width,
      height,
      mode,
      allowAnimated,
      this.collectionName,
    );

    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }

    const src = await this.fetchSomeDataUri(`/file/${id}/image`, {
      width,
      height,
      mode,
      allowAnimated,
      'max-age': 3600,
      collection: this.collectionName,
    });

    cache[key] = src;

    return src;
  }

  fetchSomeDataUri(url: string, params: Object): Promise<DataUri> {
    return this.request({
      url,
      params,
      responseType: 'image',
    }).then(this.readBlob);
  }

  private createCacheKey(
    id: string,
    width: number,
    height: number,
    mode: ImageResizeMode,
    allowAnimated: boolean,
    collectionName?: string,
  ): string {
    return `${id}:${width}x${height}:${mode}:${allowAnimated}:${collectionName}`;
  }

  private readBlob(blob: Blob): DataUri {
    const preview = URL.createObjectURL(blob);

    return preview;
  }
}
