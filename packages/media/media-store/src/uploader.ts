import * as uuid from 'uuid';
import chunkinator, { Chunk, ChunkinatorFile } from 'chunkinator';

import { MediaStore } from './media-store';
import { MediaApiConfig } from './models/auth';
import { createHasher } from './utils/hashing/hasherCreator';

// TODO: Allow to pass multiple files
export type UploadableFile = {
  content: ChunkinatorFile;
  name?: string;
  mimeType?: string;
  collection?: string;
};

export type UploadFileCallbacks = {
  onProgress: (progress: number) => void;
};

export interface UploadFileResult {
  deferredFileId: Promise<string>;
  cancel: () => void;
}

const hashingFunction = (blob: Blob): Promise<string> => {
  return createHasher().hash(blob);
};

const createProbingFunction = (store: MediaStore) => async (
  chunks: Chunk[],
): Promise<boolean[]> => {
  const response = await store.probeChunks(hashedChunks(chunks));
  const results = response.data.results;

  return (Object as any).values(results).map((result: any) => result.exists);
};

const createUploadingFunction = (store: MediaStore) => {
  return (chunk: Chunk) => store.uploadChunk(chunk.hash, chunk.blob);
};

export const uploadFile = (
  file: UploadableFile,
  config: MediaApiConfig,
  callbacks?: UploadFileCallbacks,
): UploadFileResult => {
  const { content, collection, name, mimeType } = file;
  const store = new MediaStore(config);

  const { response: deferredChunks, cancel } = chunkinator(
    content,
    {
      hashingFunction,
      hashingConcurrency: 5,
      probingBatchSize: 100,
      chunkSize: 4 * 1024 * 1024,
      uploadingConcurrency: 3,
      uploadingFunction: createUploadingFunction(store),
      probingFunction: createProbingFunction(store),
      processingBatchSize: 1000,
    },
    {
      onProgress(progress: number) {
        if (callbacks && callbacks.onProgress) {
          callbacks.onProgress(progress);
        }
      },
    },
  );

  const deferredFileId = deferredChunks
    .then(async probedChunks => {
      const uploadId = (await store.createUpload()).data[0].id;
      return { uploadId, probedChunks };
    })
    .then(async ({ uploadId, probedChunks }) => {
      await store.appendChunksToUpload(uploadId, {
        chunks: hashedChunks(probedChunks),
      });

      return uploadId;
    })
    .then(uploadId => {
      return store.createFileFromUpload(
        { uploadId, name, mimeType },
        {
          occurrenceKey: uuid.v4(),
          collection,
        },
      );
    })
    .then(resp => resp.data.id);

  return { deferredFileId, cancel };
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
