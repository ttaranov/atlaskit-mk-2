import chunkinator, { Chunk, ChunkinatorFile } from 'chunkinator';
import * as Rusha from 'rusha';

import { MediaStore } from './media-store';
import { MediaApiConfig } from './models/auth';
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

// TODO: Replace custom FileReader by Rusha.createHash().update(blob)
// Currently Rusha can't handle blobs directly so we need to do the conversion
// https://github.com/srijs/rusha/issues/55
const hashingFunction = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(blob);

    reader.onload = () => {
      resolve(
        Rusha.createHash()
          .update(reader.result)
          .digest('hex'),
      );
    };

    reader.onerror = reject;
  });
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

  const emptyFile = store.createFile();

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
      collection,
      replaceFileId: fileId,
    },
  );

  return fileId;
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
