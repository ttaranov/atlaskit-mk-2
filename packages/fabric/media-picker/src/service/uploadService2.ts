import { AuthProvider } from '@atlaskit/media-core';
import * as uuid from 'uuid';
import chunkinator, { Chunk } from 'chunkinator';

import { MediaFile } from '../domain/file';

export interface UploadServiceConfig {
  readonly apiUrl: string;
  readonly authProvider: AuthProvider;

  readonly collectionName?: string;

  onFilesStart(files: MediaFile[]): void;
}

export class UploadService2 {
  constructor(private readonly config: UploadServiceConfig) {}

  addFiles(files: File[]) {
    this.config.onFilesStart(
      files.map(file => ({
        id: uuid.v4(),
        name: file.name,
        size: file.size,
        creationDate: Date.now(),
        type: 'some-type',
      })),
    );

    files.forEach(file =>
      chunkinator(
        file,
        {
          hashingFunction: null,
          hashingConcurrency: 5,
          probingBatchSize: 3,
          chunkSize: 1000,
          uploadingConcurrency: 3,
          progressBatchSize: 3,
          uploadingFunction: this.uploader,
          probingFunction: this.prober,
        },
        {
          onComplete() {
            console.log('complete');
          },
          onError(error) {
            console.log('error', error);
          },
          onProgress(data) {
            console.log('progress', data);
          },
        },
      ),
    );
  }

  private uploader = (chunk: Chunk) => {
    return fetch(`${this.config.apiUrl}/chunk/${chunk.hash}`, {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'binary/octet-stream',
        ...this.authHeaders(),
      }),
      body: chunk.blob,
    }).then(response => {
      console.log(response);
    });
  };

  private prober = (chunks: Chunk[]) => {
    const body = JSON.stringify({
      chunks: chunks.map(hashedBlob => `${hashedBlob.hash}`),
    });

    return fetch(`${this.config.apiUrl}/chunk/probe`, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...this.authHeaders(),
      }),
      body,
    })
      .then(r => r.json())
      .then(response => {
        const results = response.data.results;

        return (Object as any)
          .values(results)
          .map((result: any) => result.exists);
      });
  };

  private authHeaders = () =>
    this.config
      .authProvider({
        collectionName: this.config.collectionName,
      })
      .then(mapAuthToAuthHeaders);
}

function mapAuthToAuthHeaders(auth: Auth): { [header: string]: any } {}
