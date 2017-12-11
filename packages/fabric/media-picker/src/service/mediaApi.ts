import {
  MediaClient,
  MediaClientRequest,
  addAuthToQueryParameters,
} from './mediaClient';
import { retryTask } from '../../util/promises';

export interface MediaArtifact {
  processingStatus: string;
  url?: string;
}

export interface MediaFileData {
  id: string;
  processingStatus?: string;
  artifacts?: { [name: string]: MediaArtifact };
}

export class MediaApi {
  createUpload(mediaClient: MediaClient): Promise<string> {
    // Media API may not be able to create the required upload container. If it fails, this function retries
    const numRetries = 5;
    const delay = 1000;
    const delayMultiplier = 2;

    const request: MediaClientRequest = {
      httpMethod: 'POST',
      mediaApiMethod: 'upload',
      parameters: {
        createUpTo: 1,
      },
    };

    // Note: There is a very rare edgecase in Safari.
    // https://product-fabric.atlassian.net/browse/MSW-12
    //
    // It can resolve two different /upload requests which happen almost simultaneously with one same response
    // (and make only one actual network call).
    return retryTask(
      () =>
        mediaClient.call(request, addAuthToQueryParameters).then(response => {
          const uploads: Array<{ id: string }> = response.data;

          if (uploads.length === 0) {
            throw new Error('No uploads were created');
          }

          return uploads[0].id;
        }),
      numRetries,
      delay,
      delayMultiplier,
    );
  }

  appendChunksToUpload(
    mediaClient: MediaClient,
    uploadId: string,
    chunkIds: Array<string>,
    offset: number,
  ): Promise<void> {
    const request: MediaClientRequest = {
      httpMethod: 'PUT',
      mediaApiMethod: `upload/${uploadId}/chunks`,
      data: {
        chunks: chunkIds,
        offset,
      },
    };

    return mediaClient.call(request) as Promise<any>;
  }

  createFileFromUpload(
    mediaClient: MediaClient,
    fileName: string,
    mimeType: string,
    uploadId: string,
    collection?: string,
  ): Promise<string> {
    const request: MediaClientRequest = {
      httpMethod: 'POST',
      mediaApiMethod: 'file/upload',
      parameters: collection ? { collection } : {},
      data: {
        name: fileName,
        mimeType,
        uploadId,
      },
    };

    return mediaClient.call(request).then(response => response.data.id);
  }

  pollForFileMetadata(
    mediaClient: MediaClient,
    fileId: string,
    collection?: string,
  ): Promise<MediaFileData> {
    const numRetries = 10;
    const delay = 1000;
    const delayMultiplier = 2;

    const request: MediaClientRequest = {
      httpMethod: 'GET',
      mediaApiMethod: `file/${fileId}`,
      parameters: collection ? { collection } : {},
    };

    return retryTask(
      () =>
        mediaClient.call(request, addAuthToQueryParameters).then(response => {
          const { data } = response;

          if (
            data.processingStatus === 'succeeded' ||
            data.processingStatus === 'failed'
          ) {
            return data;
          }

          throw new Error('Processing not finished');
        }),
      numRetries,
      delay,
      delayMultiplier,
    );
  }
}
