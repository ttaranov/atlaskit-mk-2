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

export const uploadFile = async (
  file: UploadableFile,
  config: MediaApiConfig,
  callbacks?: UploadFileCallbacks,
): Promise<string> => {
  const { content, collection, name, mimeType } = file;
  const occurrenceKey = uuid.v4();
  const store = new MediaStore(config);
  const deferredUploadId = store
    .createUpload()
    .then(response => response.data[0].id);
  const uploadingFunction = (chunk: Chunk) =>
    store.uploadChunk(chunk.hash, chunk.blob);

  let offset = 0;
  const processingFunction = async (chunks: Chunk[]) => {
    await store.appendChunksToUpload(await deferredUploadId, {
      chunks: hashedChunks(chunks),
      offset,
    });
    offset += chunks.length;
  };

  const emptyFile = store.createFile({ collection, occurrenceKey });

  await chunkinator(
    content,
    {
      hashingFunction,
      hashingConcurrency: 5,
      probingBatchSize: 100,
      chunkSize: 4 * 1024 * 1024,
      uploadingConcurrency: 3,
      uploadingFunction,
      probingFunction: createProbingFunction(store),
      processingBatchSize: 1000,
      processingFunction,
    },
    {
      onProgress(progress: number) {
        if (callbacks && callbacks.onProgress) {
          callbacks.onProgress(progress);
        }
      },
    },
  );

  const uploadId = await deferredUploadId;
  const fileId = (await emptyFile).data.id;

  await store.createFileFromUpload(
    { uploadId, name, mimeType },
    {
      occurrenceKey,
      collection,
      replaceFileId: fileId,
    },
  );

  return fileId;
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
