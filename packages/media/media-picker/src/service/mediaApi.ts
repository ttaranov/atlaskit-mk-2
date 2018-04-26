import {
  MediaClient,
  MediaClientRequest,
  addAuthToQueryParameters,
} from './mediaClient';

import { SourceFile } from '../popup/domain/source-file';

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
  copyFileToCollection(
    mediaClient: MediaClient,
    sourceFile: SourceFile,
    collection: string,
  ): Promise<void> {
    const request: MediaClientRequest = {
      httpMethod: 'POST',
      mediaApiMethod: `file/copy/withToken`,
      parameters: collection ? { collection } : {},
      data: {
        sourceFile,
      },
    };

    return mediaClient.call(request, addAuthToQueryParameters).then(() => {});
  }
}
