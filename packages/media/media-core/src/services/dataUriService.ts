import createRequest, { CreateRequestFunc } from './util/createRequest';
import { MediaItem } from '../';
import { AuthProvider } from '../auth';

export type DataUri = string;
export type ImageResizeMode = 'crop' | 'fit' | 'full-fit';

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

  fetchImageDataBlob(
    mediaItem: MediaItem,
    options: FetchImageOptions,
  ): Promise<Blob>;
}

export class MediaDataUriService implements DataUriService {
  private request: CreateRequestFunc;

  constructor(
    private readonly authProvider: AuthProvider,
    private readonly serviceHost: string,
    private readonly collectionName?: string,
    private readonly preventPreflight?: boolean
  ) {
    this.request = createRequest({
      config: {
        serviceHost: this.serviceHost,
        authProvider: this.authProvider,
      },
      collectionName: this.collectionName,
      preventPreflight: this.preventPreflight
    });
  }

  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri> {
    return this.fetchSomeDataBlob(`/file/${mediaItem.details.id}/binary`, {
      'max-age': 3600,
      collection: this.collectionName,
    }).then(this.readBlob);
  }

  fetchImageDataUri(
    mediaItem: MediaItem,
    { width, height, mode = 'crop', allowAnimated = true }: FetchImageOptions,
  ): Promise<DataUri> {
    const params =  { width, height, mode, allowAnimated };
    return this.fetchImageDataBlob(mediaItem, params).then(this.readBlob);
  }

  fetchImageDataBlob(
    mediaItem: MediaItem,
    { width, height, mode = 'crop', allowAnimated = true }: FetchImageOptions,
  ): Promise<Blob> {
    return this.fetchSomeDataBlob(`/file/${mediaItem.details.id}/image`, {
      width,
      height,
      mode,
      allowAnimated,
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  fetchSomeDataBlob(url: string, params: Object): Promise<Blob> {
    return this.request({
      url,
      params,
      responseType: 'image',
    });
  }

  private readBlob(blob: Blob): Promise<DataUri> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));

      reader.readAsDataURL(blob);
    });
  }
}
