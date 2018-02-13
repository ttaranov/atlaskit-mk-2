import chunkinator, { Chunk, ChunkinatorFile } from 'chunkinator';
import * as Rusha from 'rusha';
import { MediaStoreConfig, MediaStore } from './media-store';
// TODO: Allow to pass multiple files
export type UploadableFile = {
  content: ChunkinatorFile;
  name?: string;
  collection?: string;
};

export type Callbacks = {
  onProgress: (progress: number) => void;
};

// TODO: Replace custom FileReader by Rusha.createHash().update(blob)
// Currently Rusha can't handle blobs directly so we need to do the conversion
// https://github.com/srijs/rusha/issues/55
const hashingFunction = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(blob);

    reader.onload = (e: Event) => {
      resolve(
        Rusha.createHash()
          .update(reader.result)
          .digest('hex'),
      );
    };

    reader.onerror = reject;
  });
};

export const uploadFile = (
  file: UploadableFile,
  config: MediaStoreConfig,
  callbacks?: Callbacks,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { content, collection } = file;
    const store = new MediaStore(config);
    const deferredUploadId = store
      .createUpload()
      .then(response => response.data[0].id);
    const uploadingFunction = (chunk: Chunk) =>
      store.uploadChunk(chunk.hash, chunk.blob);
    const probingFunction = async (chunks: Chunk[]): Promise<boolean[]> => {
      const response = await store.probeChunks(hashedChunks(chunks));
      const results = response.data.results;

      return (Object as any)
        .values(results)
        .map((result: any) => result.exists);
    };
    let chunkOffset = 0;

    chunkinator(
      content,
      {
        hashingFunction,
        hashingConcurrency: 5,
        probingBatchSize: 3,
        chunkSize: 10000,
        uploadingConcurrency: 3,
        progressBatchSize: 3,
        uploadingFunction,
        probingFunction,
      },
      {
        async onComplete() {
          console.log('onComplete');

          const id = await deferredUploadId;
          const response = await store.createFileFromUpload(id, collection);
          const fileId = response.data.id;

          resolve(fileId);
        },
        onError(error) {
          console.log('error', error);
          reject(error);
        },
        async onProgress(progress, chunks) {
          console.log('onProgress', chunks);
          const id = await deferredUploadId;

          store.appendChunksToUpload(id, hashedChunks(chunks), chunkOffset);
          chunkOffset += chunks.length;

          if (callbacks && callbacks.onProgress) {
            callbacks.onProgress(progress);
          }
        },
      },
    );
  });
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
