import createRequest, { CreateRequestFunc } from './util/createRequest';
import { MediaItem } from '../';
import { AuthProvider } from '../auth';

export type DataUri = string;
export type ImageResizeMode = 'crop' | 'fit' | 'full-fit';

export interface DataUriService {
  fetchOriginalDataUri(mediaItem: MediaItem): Promise<DataUri>;
  fetchImageDataUri(
    mediaItem: MediaItem,
    width: number,
    height: number,
    mode?: ImageResizeMode,
    allowAnimated?: boolean,
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

  fetchImageDataUri(
    mediaItem: MediaItem,
    width: number,
    height: number,
    mode: ImageResizeMode = 'crop',
    allowAnimated: boolean = true,
  ): Promise<DataUri> {
    return this.fetchSomeDataUri(`/file/${mediaItem.details.id}/image`, {
      width,
      height,
      mode,
      allowAnimated,
      'max-age': 3600,
      collection: this.collectionName,
    });
  }

  fetchSomeDataUri(url: string, params: Object): Promise<DataUri> {
    return this.request({
      url,
      params,
      responseType: 'image',
    }).then(this.readBlob);
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
