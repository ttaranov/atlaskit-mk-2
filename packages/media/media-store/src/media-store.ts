import {
  MediaFile,
  MediaCollection,
  MediaCollectionItems,
  MediaUpload,
  MediaChunksProbe,
} from './models/media';
import {
  AsapBasedAuth,
  AuthContext,
  ClientAltBasedAuth,
  MediaApiConfig,
} from './models/auth';
import {
  request,
  createUrl,
  mapResponseToJson,
  RequestMethod,
  RequestParams,
  RequestHeaders,
  mapResponseToVoid,
  mapResponseToBlob,
} from './utils/request';

const defaultImageOptions: MediaStoreGetFileImageParams = {
  'max-age': 3600,
  allowAnimated: true,
  mode: 'crop',
};

const defaultGetCollectionItems: MediaStoreGetCollectionItemsParams = {
  limit: 30,
  sortDirection: 'desc',
};

const extendImageParams = (
  params?: MediaStoreGetFileImageParams,
): MediaStoreGetFileImageParams => {
  return { ...defaultImageOptions, ...params };
};

export class MediaStore {
  constructor(private readonly config: MediaApiConfig) {}

  createCollection(
    collectionName: string,
  ): Promise<MediaStoreResponse<MediaCollection>> {
    return this.request('/collection', {
      method: 'POST',
      body: JSON.stringify({ name: collectionName }),
      authContext: { collectionName },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(mapResponseToJson);
  }

  getCollection(
    collectionName: string,
  ): Promise<MediaStoreResponse<MediaCollection>> {
    return this.request(`/collection/${collectionName}`, {
      authContext: { collectionName },
      headers: {
        Accept: 'application/json',
      },
    }).then(mapResponseToJson);
  }

  async getCollectionItems(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
  ): Promise<MediaStoreResponse<MediaCollectionItems>> {
    const response = await this.request(`/collection/${collectionName}/items`, {
      authContext: { collectionName },
      params: {
        ...defaultGetCollectionItems,
        ...params,
      },
      headers: {
        Accept: 'application/json',
      },
    });
    const {
      data: { contents, nextInclusiveStartKey },
    }: MediaStoreResponse<MediaCollectionItems> = await mapResponseToJson(
      response,
    );
    // [TODO] MS-705: remove after backend adds filter
    // This prevents showing "ghost" files in recents
    const contentsWithoutEmptyFiles = contents.filter(
      item => item.details.size && item.details.size > 0,
    );

    return {
      data: {
        contents: contentsWithoutEmptyFiles,
        nextInclusiveStartKey,
      },
    };
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
      authContext: { collectionName: params.collection },
      params,
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(mapResponseToJson);
  }

  createFile(
    params: MediaStoreCreateFileParams = {},
  ): Promise<MediaStoreResponse<EmptyFile>> {
    return this.request('/file', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      params,
      authContext: { collectionName: params.collection },
    }).then(mapResponseToJson);
  }

  createFileFromBinary(
    blob: Blob,
    params: MediaStoreCreateFileFromBinaryParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> {
    return this.request('/file/binary', {
      method: 'POST',
      body: blob,
      params,
      headers: {
        Accept: 'application/json',
        'Content-Type': blob.type,
      },
      authContext: { collectionName: params.collection },
    }).then(mapResponseToJson);
  }

  getFile = (
    fileId: string,
    params: MediaStoreGetFileParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> => {
    return this.request(`/file/${fileId}`, {
      params,
      authContext: { collectionName: params.collection },
    }).then(mapResponseToJson);
  };

  getFileImageURL = async (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> => {
    const auth = await this.config.authProvider();

    return createUrl(`${auth.baseUrl}/file/${id}/image`, {
      params: extendImageParams(params),
      auth,
    });
  };

  getFileBinaryURL = async (
    id: string,
    collectionName?: string,
  ): Promise<string> => {
    const auth = await this.config.authProvider({ collectionName });

    return createUrl(`${auth.baseUrl}/file/${id}/binary`, {
      params: { dl: true, collection: collectionName },
      auth,
    });
  };

  getImage = (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<Blob> => {
    return this.request(`/file/${id}/image`, {
      params: extendImageParams(params),
      authContext: { collectionName: params && params.collection },
    }).then(mapResponseToBlob);
  };

  getImageMetadata = (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<{ metadata: ImageMetadata }> => {
    return this.request(`/file/${id}/image/metadata`, {
      params,
      authContext: { collectionName: params && params.collection },
    }).then(mapResponseToJson);
  };

  appendChunksToUpload(
    uploadId: string,
    body: AppendChunksToUploadRequestBody,
  ): Promise<void> {
    return this.request(`/upload/${uploadId}/chunks`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(mapResponseToVoid);
  }

  copyFileWithToken(
    body: MediaStoreCopyFileWithTokenBody,
    params: MediaStoreCopyFileWithTokenParams,
  ): Promise<MediaStoreResponse<MediaFile>> {
    return this.request('/file/copy/withToken', {
      method: 'POST',
      authContext: { collectionName: params.collection }, // Contains collection name to write to
      body: JSON.stringify(body), // Contains collection name to read from
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params, // Contains collection name to write to
    }).then(mapResponseToJson);
  }

  async request(
    path: string,
    options: MediaStoreRequestOptions = {
      method: 'GET',
    },
  ): Promise<Response> {
    const { authProvider } = this.config;
    const { method, authContext, params, headers, body } = options;

    const auth = await authProvider(authContext);

    return request(`${auth.baseUrl}${path}`, {
      method,
      auth,
      params,
      headers,
      body,
    });
  }
}

export type ImageMetadataArtifact = {
  url?: string;
  width?: number;
  height?: number;
  size?: number;
};

export interface ImageMetadata {
  pending: boolean;
  preview?: ImageMetadataArtifact;
  original?: ImageMetadataArtifact;
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

export type MediaStoreCreateFileParams = {
  readonly occurrenceKey?: string;
  readonly collection?: string;
};

export type MediaStoreCreateFileFromBinaryParams = {
  readonly replaceFileId?: string;
  readonly collection?: string;
  readonly occurrenceKey?: string;
  readonly expireAfter?: number;
  readonly skipConversions?: boolean;
  readonly name?: string;
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
  readonly allowAnimated?: boolean;
  readonly version?: number;
  readonly collection?: string;
  readonly width?: number;
  readonly height?: number;
  readonly mode?: 'fit' | 'full-fit' | 'crop';
  readonly upscale?: boolean;
  readonly 'max-age'?: number;
};

export type MediaStoreGetCollectionItemsParams = {
  readonly limit?: number;
  readonly inclusiveStartKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
  readonly details?: 'minimal' | 'full';
};

export interface SourceFile {
  id: string;
  owner: ClientAltBasedAuth | AsapBasedAuth;
  collection?: string;
  version?: number;
}

export type MediaStoreCopyFileWithTokenBody = {
  sourceFile: SourceFile;
};

export type MediaStoreCopyFileWithTokenParams = {
  readonly collection?: string;
  readonly replaceFileId?: string;
  readonly occurrenceKey?: string;
};

export type AppendChunksToUploadRequestBody = {
  readonly chunks: string[];

  readonly hash?: string;
  readonly offset?: number;
};

export interface EmptyFile {
  readonly id: string;
  readonly createdAt: number;
}
