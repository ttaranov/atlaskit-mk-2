import axios from 'axios';
import * as url from 'url';
import { Auth, FileDetails } from '@atlaskit/media-core';
import {
  AuthHeaders,
  Service,
  ServiceAccountWithType,
  ServiceFolder,
  ServiceFolderItem,
  ServiceName,
} from '../../domain';

import { mapAuthToAuthHeaders } from '../../domain/auth';

const METADATA_POLL_INTERVAL_MS = 2000;
type Method = 'GET' | 'POST' | 'DELETE';

export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  size: string;
  mp4: string;
  mp4_size: string;
  webp: string;
  webp_size: string;
}

export interface GiphyResponse {
  data: [
    {
      id: string;
      slug: string;
      images: { fixed_width: GiphyImage; original: GiphyImage };
    }
  ];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

export interface GiphyData {
  cardModels: ImageCardModel[];
  totalResultCount: number;
}

export interface ImageCardModel {
  metadata: FileDetails;
  dataURI: string;
  dimensions: { width: number; height: number };
}

export interface Fetcher {
  fetchCloudAccountFolder(
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder>;
  pollFile(
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<FileDetails>;
  getImage(auth: Auth, fileId: string, collection?: string): Promise<Blob>;
  getServiceList(auth: Auth): Promise<ServiceAccountWithType[]>;
  unlinkCloudAccount(auth: Auth, accountId: string): Promise<void>;
  fetchTrendingGifs(offset?: number): Promise<GiphyData>;
  fetchGifsRelevantToSearch(query: string, offset?: number): Promise<GiphyData>;
}

export class MediaApiFetcher implements Fetcher {
  constructor() {}

  fetchCloudAccountFolder(
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder> {
    return this.query<{ data: ServiceFolder }>(
      `${pickerUrl(auth.baseUrl)}/service/${serviceName}/${accountId}/folder`,
      'GET',
      {
        folderId,
        limit: 100,
        cursor,
      },
      mapAuthToAuthHeaders(auth),
    ).then(({ data: serviceFolder }) => {
      if (serviceName === 'dropbox') {
        return {
          ...serviceFolder,
          items: this.sortDropboxFiles(serviceFolder.items),
        };
      } else {
        return serviceFolder;
      }
    });
  }

  // TODO [MS-725]: remove
  pollFile(
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<FileDetails> {
    return new Promise((resolve, reject) => {
      return this.query<{ data: FileDetails }>(
        `${fileStoreUrl(auth.baseUrl)}/file/${fileId}`,
        'GET',
        {
          collection,
        },
        mapAuthToAuthHeaders(auth),
      )
        .then(({ data: file }) => {
          if (
            file.processingStatus === 'succeeded' ||
            file.processingStatus === 'failed'
          ) {
            resolve(file);
          } else {
            setTimeout(() => {
              this.pollFile(auth, fileId, collection).then(resolve, reject);
            }, METADATA_POLL_INTERVAL_MS);
          }
        })
        .catch(() => {
          // this._handleUploadError('metadata_fetch_fail', JSON.stringify(err));
          reject('metadata_fetch_fail');
        });
    });
  }

  getImage(auth: Auth, fileId: string, collection?: string): Promise<Blob> {
    const collectionName = collection ? `?collection=${collection}` : '';
    const url = `${fileStoreUrl(
      auth.baseUrl,
    )}/file/${fileId}/image${collectionName}`;

    return this.query(
      url,
      'GET',
      { mode: 'full-fit' },
      mapAuthToAuthHeaders(auth),
      'blob',
    );
  }

  getServiceList(auth: Auth): Promise<ServiceAccountWithType[]> {
    return this.query<{ data: Service[] }>(
      `${pickerUrl(auth.baseUrl)}/accounts`,
      'GET',
      {},
      mapAuthToAuthHeaders(auth),
    ).then(({ data: services }) => flattenAccounts(services));
  }

  unlinkCloudAccount(auth: Auth, accountId: string): Promise<void> {
    return this.query(
      `${pickerUrl(auth.baseUrl)}/account/${accountId}`,
      'DELETE',
      {},
      mapAuthToAuthHeaders(auth),
    );
  }

  fetchTrendingGifs = (offset?: number): Promise<GiphyData> => {
    const baseUrl = 'https://api.giphy.com/v1/gifs/trending';

    const requestConfig = {
      url: `${baseUrl}`,
      params: {
        // TODO Move these keys somewhere in config MSW-406
        api_key: 'lBOxhhz1BM62Y3JsK0iQv1pRYyOGUjR8',
        rating: 'pg',
        offset,
      },
    };

    return axios
      .request(requestConfig)
      .then(response => this.mapGiphyResponseToViewModel(response.data));
  };

  fetchGifsRelevantToSearch = (
    query: string,
    offset?: number,
  ): Promise<GiphyData> => {
    const baseUrl = 'https://api.giphy.com/v1/gifs/search';

    const requestConfig = {
      url: `${baseUrl}`,
      params: {
        api_key: 'lBOxhhz1BM62Y3JsK0iQv1pRYyOGUjR8',
        rating: 'pg',
        q: query,
        offset,
      },
    };

    return axios
      .request(requestConfig)
      .then(response => this.mapGiphyResponseToViewModel(response.data));
  };

  private mapGiphyResponseToViewModel = (
    response: GiphyResponse,
  ): GiphyData => {
    const { data, pagination } = response;

    const cardModels = data.map(gif => {
      const { id, slug } = gif;
      const { size, url, width, height } = gif.images.fixed_width;

      const name = slug.replace(new RegExp(`-${id}`), '');
      const metadata: FileDetails = {
        id,
        name,
        mediaType: 'image',
        size: parseInt(size, 10),
      };

      return {
        metadata,
        dataURI: url,
        dimensions: {
          width: parseInt(width, 10),
          height: parseInt(height, 10),
        },
      };
    });

    return {
      cardModels,
      totalResultCount: pagination.total_count,
    };
  };

  private parsePayload(
    method: Method,
    payload: any,
  ): { data?: any; params?: any } {
    if (method === 'GET') {
      return { params: payload };
    } else {
      return { data: payload };
    }
  }

  private query<R = void>(
    url: string,
    method: Method,
    payload: any,
    authHeaders: AuthHeaders,
  ): Promise<R>;
  private query(
    url: string,
    method: Method,
    payload: any,
    authHeaders: AuthHeaders,
    responseType: 'blob',
  ): Promise<Blob>;
  private query<R = void>(
    url: string,
    method: Method,
    payload: any,
    authHeaders: AuthHeaders,
    responseType?: string,
  ): Promise<R> | Promise<Blob> {
    const contentType = 'application/json; charset=utf-8';
    const headers = {
      ...authHeaders,
      'Content-Type': contentType,
    };
    const { data, params } = this.parsePayload(method, payload);
    const config = {
      url,
      method,
      headers,
      data,
      params,
      contentType,
      responseType,
    };

    return axios.request(config).then(response => response.data);
  }

  private isFolder(item: ServiceFolderItem): boolean {
    return item.mimeType === 'application/vnd.atlassian.mediapicker.folder';
  }

  private sortDropboxFiles(items: ServiceFolderItem[]): ServiceFolderItem[] {
    return items.sort((a, b) => {
      const isAFolder = this.isFolder(a);
      const isBFolder = this.isFolder(b);

      if (!isAFolder && isBFolder) {
        return 1;
      }
      if (isAFolder && !isBFolder) {
        return -1;
      }

      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aName > bName) {
        return 1;
      } else if (aName < bName) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}

export const fileStoreUrl = (baseUrl: string): string => {
  const { protocol, host } = url.parse(baseUrl);
  return `${protocol}//${host}`;
};

export const pickerUrl = (baseUrl: string): string => {
  return `${fileStoreUrl(baseUrl)}/picker`;
};

export function flattenAccounts(services: Service[]): ServiceAccountWithType[] {
  return services.reduce(
    (accounts, service) =>
      accounts.concat(
        service.accounts.map(account => ({
          ...account,
          type: service.type,
        })),
      ),
    new Array<ServiceAccountWithType>(),
  );
}
