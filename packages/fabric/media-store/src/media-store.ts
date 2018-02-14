import { AuthProvider, AuthContext } from './models/auth-provider';
import {
  MediaFile,
  MediaCollection,
  MediaCollectionItems,
  MediaUpload,
  MediaChunksProbe,
} from './models/media';
import {
  request,
  createUrl,
  mapResponseToJson,
  RequestMethod,
  RequestParams,
  RequestHeaders,
  mapResponseToVoid,
} from './utils/request';

export interface MediaStoreConfig {
  readonly apiUrl: string;
  readonly authProvider: AuthProvider;
}

export class MediaStore {
  constructor(private readonly config: MediaStoreConfig) {}

  createCollection(name: string): Promise<MediaStoreResponse<MediaCollection>> {
    return this.request('/collection', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(mapResponseToJson);
  }

  getCollection(
    collectionName: string,
  ): Promise<MediaStoreResponse<MediaCollection>> {
    return this.request(`/collection/${collectionName}`).then(
      mapResponseToJson,
    );
  }

  getCollectionItems(
    collectionName: string,
    params: MediaStoreGetCollectionItemsPrams,
  ): Promise<MediaStoreResponse<MediaCollectionItems>> {
    return this.request(`/collection/${collectionName}/items`, { params }).then(
      mapResponseToJson,
    );
  }

  deleteCollection(name: string): Promise<void> {
    return Promise.reject('not implemented yet');
  }

  createUpload(
    createUpTo: number = 1,
  ): Promise<MediaStoreResponse<MediaUpload[]>> {
    return this.request(`/upload`, {
      method: 'POST',
      params: {
        createUpTo,
      },
      headers: {
        Accept: 'application/json',
      },
    }).then(mapResponseToJson);
  }

  uploadChunk(etag: string, blob: Blob): Promise<void> {
    return this.request(`/chunk/${etag}`, {
      method: 'PUT',
      body: blob,
    }).then(mapResponseToVoid);
  }

  probeChunks(chunks: string[]): Promise<MediaStoreResponse<MediaChunksProbe>> {
    return this.request(`/chunk/probe`, {
      method: 'POST',
      body: JSON.stringify({
        chunks,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(mapResponseToJson);
  }

  createFileFromUpload(
    body: MediaStoreCreateFileFromUploadBody,
    params: MediaStoreCreateFileFromUploadParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> {
    return this.request('/file/upload', {
      method: 'POST',
      params,
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(mapResponseToJson);
  }

  getFile = (
    fileId: string,
    params: MediaStoreGetFileParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> => {
    return this.request(`/file/${fileId}`, { params }).then(mapResponseToJson);
  };

  getFileImageURL = async (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> => {
    return createUrl(`${this.config.apiUrl}/file/${id}/image`, {
      params,
      auth: await this.config.authProvider(),
    });
  };

  appendChunksToUpload = (
    uploadId: string,
    chunks: string[],
    offset: number,
  ) => {
    const body = JSON.stringify({
      chunks,
      offset,
    });

    return this.request(`/upload/${uploadId}/chunks`, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  async request(
    path: string,
    options: MediaStoreRequestOptions = {
      method: 'GET',
    },
  ): Promise<Response> {
    const { apiUrl, authProvider } = this.config;
    const { method, authContext, params, headers, body } = options;

    const auth = await authProvider(authContext);

    return request(`${apiUrl}${path}`, {
      method,
      auth,
      params,
      headers,
      body,
    });
  }
}

export interface MediaStoreResponse<Data> {
  readonly data: Data;
}

export type MediaStoreRequestOptions = {
  readonly method?: RequestMethod;
  readonly authContext?: AuthContext;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
};

export type MediaStoreCreateFileFromUploadParams = {
  readonly collection?: string;
  readonly occurrenceKey?: string;
  readonly expireAfter?: number;
  readonly replaceFileId?: string;
  readonly skipConversions?: boolean;
};

export type MediaStoreCreateFileFromUploadConditions = {
  readonly hash: string;
  readonly size: number;
};

export type MediaStoreCreateFileFromUploadBody = {
  readonly uploadId: string;

  readonly name?: string;
  readonly mimeType?: string;
  readonly conditions?: MediaStoreCreateFileFromUploadConditions;
};

export type MediaStoreGetFileParams = {
  readonly version?: number;
  readonly collection?: string;
};

export type MediaStoreGetFileImageParams = {
  readonly version?: number;
  readonly collection?: number;
  readonly width?: number;
  readonly height?: number;
  readonly mode?: 'fit' | 'full-fit' | 'crop';
  readonly upscale?: boolean;
  readonly 'max-age': number;
  readonly allowAnimated: boolean;
};

export type MediaStoreGetCollectionItemsPrams = {
  readonly limit: number;

  readonly inclusiveStartKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
  readonly details?: 'minimal' | 'full';
};
