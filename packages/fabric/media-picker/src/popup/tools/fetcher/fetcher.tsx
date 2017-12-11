import axios from 'axios';
import * as url from 'url';
import { Auth } from '@atlaskit/media-core';
import { ImagePreview } from '../../../domain/image';
import { fileToBase64 } from '../fileToBase64';

import {
  AuthHeaders,
  CollectionItem,
  File,
  Service,
  ServiceAccountWithType,
  ServiceFolder,
  ServiceFolderItem,
  ServiceName,
  SourceFile,
} from '../../domain';

import { mapAuthToAuthHeaders } from '../../domain/auth';

const METADATA_POLL_INTERVAL_MS = 2000;
const PREVIEW_WIDTH = 640;
const PREVIEW_HEIGHT = 480;

export interface GetRecentFilesData {
  readonly contents: CollectionItem[];
  readonly nextInclusiveStartKey: string;
}

type Method = 'GET' | 'POST' | 'DELETE';

export interface CopyFileDestination {
  readonly auth: Auth;
  readonly collection?: string;
}

export interface Fetcher {
  fetchCloudAccountFolder(
    apiUrl: string,
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder>;
  pollFile(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<File>;
  getPreview(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<Blob>;
  getImagePreview(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<ImagePreview>;
  getImage(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<Blob>;
  getServiceList(apiUrl: string, auth: Auth): Promise<ServiceAccountWithType[]>;
  getRecentFiles(
    apiUrl: string,
    auth: Auth,
    limit: number,
    sortDirection: string,
    inclusiveStartKey?: string,
  ): Promise<GetRecentFilesData>;
  unlinkCloudAccount(
    apiUrl: string,
    auth: Auth,
    accountId: string,
  ): Promise<void>;
  copyFile(
    apiUrl: string,
    sourceFile: SourceFile,
    destination: CopyFileDestination,
    collection?: string,
  ): Promise<File>;
}

export class MediaApiFetcher implements Fetcher {
  constructor() {}

  fetchCloudAccountFolder(
    apiUrl: string,
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder> {
    return this.query<{ data: ServiceFolder }>(
      `${this.pickerUrl(apiUrl)}/service/${serviceName}/${accountId}/folder`,
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

  pollFile(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      return this.query<{ data: File }>(
        `${this.fileStoreUrl(apiUrl)}/file/${fileId}`,
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
              this.pollFile(apiUrl, auth, fileId, collection).then(
                resolve,
                reject,
              );
            }, METADATA_POLL_INTERVAL_MS);
          }
        })
        .catch(error => {
          // this._handleUploadError('metadata_fetch_fail', JSON.stringify(err));
          reject('metadata_fetch_fail');
        });
    });
  }

  getPreview(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<Blob> {
    return this.pollFile(apiUrl, auth, fileId, collection).then(file => {
      if (file.processingStatus === 'failed') {
        return Promise.reject('get_preview_failed');
      }

      return this.query(
        `${this.fileStoreUrl(apiUrl)}/file/${fileId}/image`,
        'GET',
        {
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          collection,
        },
        mapAuthToAuthHeaders(auth),
        'blob',
      );
    });
  }

  getImagePreview(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<ImagePreview> {
    return this.getPreview(apiUrl, auth, fileId, collection)
      .then(fileToBase64)
      .then(src => ({
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        src,
      }));
  }

  getImage(
    apiUrl: string,
    auth: Auth,
    fileId: string,
    collection?: string,
  ): Promise<Blob> {
    const collectionName = collection ? `?collection=${collection}` : '';
    const url = `${this.fileStoreUrl(apiUrl)}/file/${fileId}/image${
      collectionName
    }`;

    return this.query(
      url,
      'GET',
      { mode: 'full-fit' },
      mapAuthToAuthHeaders(auth),
      'blob',
    );
  }

  getServiceList(
    apiUrl: string,
    auth: Auth,
  ): Promise<ServiceAccountWithType[]> {
    return this.query<{ data: Service[] }>(
      `${this.pickerUrl(apiUrl)}/accounts`,
      'GET',
      {},
      mapAuthToAuthHeaders(auth),
    ).then(({ data: services }) => flattenAccounts(services));
  }

  getRecentFiles(
    apiUrl: string,
    auth: Auth,
    limit: number,
    sortDirection: string,
    inclusiveStartKey?: string,
  ): Promise<GetRecentFilesData> {
    return this.query<{ data: GetRecentFilesData }>(
      `${this.fileStoreUrl(apiUrl)}/collection/recents/items`,
      'GET',
      {
        sortDirection,
        limit,
        inclusiveStartKey,
      },
      mapAuthToAuthHeaders(auth),
    ).then(({ data }) => data);
  }

  unlinkCloudAccount(
    apiUrl: string,
    auth: Auth,
    accountId: string,
  ): Promise<void> {
    return this.query(
      `${this.pickerUrl(apiUrl)}/account/${accountId}`,
      'DELETE',
      {},
      mapAuthToAuthHeaders(auth),
    );
  }

  copyFile(
    apiUrl: string,
    sourceFile: SourceFile,
    { auth, collection }: CopyFileDestination,
  ): Promise<File> {
    const params = collection ? `?collection=${collection}` : '';
    return this.query<{ data: File }>(
      `${this.fileStoreUrl(apiUrl)}/file/copy/withToken${params}`,
      'POST',
      JSON.stringify({ sourceFile }),
      mapAuthToAuthHeaders(auth),
    ).then(({ data: file }) => file);
  }

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

    return Promise.resolve(
      axios.request(config).then(response => response.data),
    );
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

  private fileStoreUrl(apiUrl: string): string {
    const { protocol, host } = url.parse(apiUrl);
    return `${protocol}//${host}`;
  }

  private pickerUrl(apiUrl: string): string {
    return `${this.fileStoreUrl(apiUrl)}/picker`;
  }
}

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
