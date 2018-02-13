import { AuthProvider, AuthContext } from './models/auth-provider';
import { Auth } from './models/auth';
import { mapAuthToQueryParameters } from './models/auth-query-parameters';
import { mapAuthToAuthHeaders } from './models/auth-headers';
import {
  MediaFile,
  MediaCollection,
  MediaCollectionItems,
  MediaUpload,
} from './models/media';

export interface MediaStoreConfig {
  readonly apiUrl: string;
  readonly authProvider: AuthProvider;
}

export interface MediaStoreResponse<Data> {
  readonly data: Data;
}

export type ProbeChunks = {
  results: {
    [etag: string]: {
      exists: boolean;
    };
  };
};

export type FetchOptions = {
  readonly method?: Method;
  readonly authContext?: AuthContext;
  readonly body?: any;
  readonly params?: FetchParams;
};

export type FetchParams = { [key: string]: any };

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

export class MediaStore {
  constructor(private readonly config: MediaStoreConfig) {}

  createCollection(name: string): Promise<MediaStoreResponse<MediaCollection>> {
    const body = {
      name,
    };

    return this.fetch('/collection', { method: 'POST', body }).then(
      mapResponseToJson,
    );
  }

  getCollection(
    collectionName: string,
  ): Promise<MediaStoreResponse<MediaCollection>> {
    return this.fetch(`/collection/${collectionName}`).then(mapResponseToJson);
  }

  getCollectionItems(
    collectionName: string,
    params: MediaStoreGetCollectionItemsPrams,
  ): Promise<MediaStoreResponse<MediaCollectionItems>> {
    return this.fetch(`/collection/${collectionName}/items`, { params }).then(
      mapResponseToJson,
    );
  }

  deleteCollection(name: string): Promise<void> {
    return Promise.reject('not implemented yet');
  }

  createUpload = (
    createUpTo: number = 1,
  ): Promise<MediaStoreResponse<MediaUpload[]>> => {
    return this.fetch(`/upload?createUpTo=${createUpTo}`, {
      method: 'POST',
    }).then(mapResponseToJson);
  };

  uploadChunk = (etag: string, blob: Blob): Promise<void> => {
    return this.fetch(`/chunk/${etag}`, {
      method: 'PUT',
      body: blob,
    }).then(() => {});
  };

  probeChunks = (
    chunks: string[],
  ): Promise<MediaStoreResponse<ProbeChunks>> => {
    const body = JSON.stringify({
      chunks,
    });

    return this.fetch(`/chunk/probe`, {
      method: 'POST',
      body,
    }).then(mapResponseToJson);
  };

  createFileFromUpload = (
    uploadId: string,
    collection?: string,
  ): Promise<MediaStoreResponse<MediaFile>> => {
    const body = JSON.stringify({
      uploadId,
    });
    const params = collection ? { collection } : undefined;

    return this.fetch('/file/upload', {
      method: 'POST',
      params,
      body,
    }).then(mapResponseToJson);
  };

  getFile = (
    fileId: string,
    params: MediaStoreGetFileParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> => {
    return this.fetch(`/file/${fileId}`, { params }).then(mapResponseToJson);
  };

  getFileImageURL = async (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> => {
    const auth = await this.config.authProvider();
    return authenticateUrl(this.createURL(`/file/${id}/image`, params), auth);
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

    return this.fetch(`/upload/${uploadId}/chunks`, {
      method: 'PUT',
      body,
    });
  };

  private createURL(path: string, params: FetchParams = {}): string {
    const url = new URL(`${this.config.apiUrl}${path}`);

    Object.keys(params).forEach(key => {
      url.searchParams.set(key, params[key]);
    });

    return url.toString();
  }

  private fetch(
    path: string,
    fetchOptions: FetchOptions = {
      method: 'GET',
    },
  ): Promise<Response> {
    const { method, body, authContext, params } = fetchOptions;
    const request = new Request(this.createURL(path, params), {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.config
      .authProvider(authContext)
      .then(auth => fetch(this.withAuth(auth)(request)));
  }

  private withAuth = (auth: Auth) => (request: Request): Request => {
    if (request.method === 'GET') {
      return new Request(authenticateUrl(request.url, auth), {
        headers: request.headers,
      });
    } else {
      const authenticatedRequest = request.clone();
      const authHeaders = mapAuthToAuthHeaders(auth);

      Object.keys(authHeaders).forEach(name =>
        authenticatedRequest.headers.set(name, authHeaders[name]),
      );

      return authenticatedRequest;
    }
  };
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const mapResponseToJson = (response: Response): Promise<any> => response.json();

function authenticateUrl(url: string, auth: Auth): string {
  const result = new URL(url);
  const authParams = mapAuthToQueryParameters(auth);

  Object.keys(authParams).forEach(name =>
    result.searchParams.set(name, authParams[name]),
  );

  return result.toString();
}
