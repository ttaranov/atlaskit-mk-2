import createRequest, { CreateRequestFunc } from './util/createRequest';
import { MediaItem } from '../';
import { AuthProvider } from '../auth';

export type ImageResizeMode = 'crop' | 'fit' | 'full-fit';

export interface FetchImageOptions {
  width: number;
  height: number;
  mode?: ImageResizeMode;
  allowAnimated?: boolean;
}

export interface BlobService {
  fetchOriginalBlob(mediaItem: MediaItem): Promise<Blob>;
  fetchImageBlob(
    mediaItem: MediaItem,
    options: FetchImageOptions,
  ): Promise<Blob>;
}

export class MediaBlobService implements BlobService {
  public request: CreateRequestFunc;

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

  fetchOriginalBlob(mediaItem: MediaItem): Promise<Blob> {
    return this.fetchSomeBlob(`/file/${mediaItem.details.id}/binary`, {
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  fetchImageBlob(
    mediaItem: MediaItem,
    { width, height, mode = 'crop', allowAnimated = true }: FetchImageOptions,
  ): Promise<Blob> {
    return this.fetchSomeBlob(`/file/${mediaItem.details.id}/image`, {
      width,
      height,
      mode,
      allowAnimated,
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  // this is not private just for testing
  fetchSomeBlob(url: string, params: Object): Promise<Blob> {
    return this.request({
      url,
      params,
      responseType: 'image', // TODO: use blob?
    });
  }
}
