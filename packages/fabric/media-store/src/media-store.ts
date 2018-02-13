import { AuthProvider, AuthContext } from './models/auth-provider';
import { Auth } from './models/auth';
import { mapAuthToQueryParameters } from './models/auth-query-parameters';
import { URLSearchParams } from 'url';
import { mapAuthToAuthHeaders } from './models/auth-headers';

export interface MediaStoreConfig {
  readonly apiUrl: string;
  readonly authProvider: AuthProvider;
}

export interface MediaStoreResponse<Data> {
  readonly data: Data;
}

export interface MediaStoreCollection {
  readonly name: string;
  readonly createdAt: number;
}

export interface MediaUpload {
  readonly id: string;
  readonly created: number;
  readonly expires: number;
}

export type MediaFile = {
  id: string;
  mediaType: string;
  mimeType: string;
  name: string;
  processingStatus: string;
  size: number;
  artifacts: {
    [artifactName: string]: {
      href: string;
      processingStatus: string;
    };
  };
};

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
  readonly params?: { [key: string]: string };
  // readonly responseType?: 'json' | 'blob';
};

export class MediaStore {
  constructor(private readonly config: MediaStoreConfig) {}

  createCollection(
    name: string,
  ): Promise<MediaStoreResponse<MediaStoreCollection>> {
    const body = {
      name,
    };

    return this.fetch('/collection', { method: 'POST', body }).then(
      mapResponseToJson,
    );
  }

  getCollection(
    name: string,
  ): Promise<MediaStoreResponse<MediaStoreCollection>> {
    return Promise.reject('not implemented yet');
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

  fetchFile = (fileId: string): Promise<MediaStoreResponse<MediaFile>> => {
    return this.fetch(`/file/${fileId}`).then(mapResponseToJson);
  };

  getFileImageURL = async (id: string, dimensions?: any): Promise<string> => {
    const auth = await this.config.authProvider();

    return this.withAuth(auth)(new Request(this.createURL(`/file/${id}/image`)))
      .url;
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

  private createURL(path: string, params?: { [key: string]: string }): string {
    const url = new URL(`${this.config.apiUrl}${path}`);

    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.set(key, params[key]);
      });
    }

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
