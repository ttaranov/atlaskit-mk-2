import * as uuid from 'uuid';
import chunkinator, { Chunk, ChunkinatorFile } from 'chunkinator';

import { MediaStore } from './media-store';
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
  onId?: (id: string) => void;
};

export interface UploadFileResult {
  deferredFileId: Promise<string>;
  cancel: () => void;
}

const hashingFunction = async (blob: Blob): Promise<string> => {
  const hasher = await createHasher();

  return hasher.hash(blob);
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

const createProcessingFunction = (
  store: MediaStore,
  deferredUploadId: Promise<string>,
) => {
  let offset = 0;
  return async (chunks: Chunk[]) => {
    await store.appendChunksToUpload(await deferredUploadId, {
      chunks: hashedChunks(chunks),
      offset,
    });
    offset += chunks.length;
  };
};

export const uploadFile = (
  file: UploadableFile,
  store: MediaStore,
  callbacks?: UploadFileCallbacks,
): UploadFileResult => {
  const { content, collection, name, mimeType } = file;
  const occurrenceKey = uuid.v4();
  const deferredUploadId = store
    .createUpload()
    .then(response => response.data[0].id);
  const deferredEmptyFile = store.createFile({ collection, occurrenceKey });
  const { response, cancel } = chunkinator(
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
      processingFunction: createProcessingFunction(store, deferredUploadId),
    },
    {
      onProgress(progress: number) {
        if (callbacks && callbacks.onProgress) {
          callbacks.onProgress(progress);
        }
      },
    },
  );

  const onId = callbacks && callbacks.onId;
  if (onId) {
    deferredEmptyFile.then(emptyFile => {
      const fileId = emptyFile.data.id;
      onId(fileId);
    });
  }

  const fileId = Promise.all([
    deferredUploadId,
    deferredEmptyFile,
    response,
  ]).then(([uploadId, emptyFile]) => {
    const fileId = emptyFile.data.id;

    return store
      .createFileFromUpload(
        { uploadId, name, mimeType },
        {
          occurrenceKey,
          collection,
          replaceFileId: fileId,
        },
      )
      .then(() => fileId);
  });

  return { deferredFileId: fileId, cancel };
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
