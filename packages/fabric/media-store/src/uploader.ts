import chunkinator, { Chunk } from 'chunkinator';
import { MediaStoreConfig, MediaStore } from './media-store';
// TODO: Extend Chunkinator with file: string | Blob
// TODO: Allow to pass multiple files
export type UploadableFile = {
  content: string | Blob;
  name?: string;
  collection?: string;
};

export type Callbacks = {
  onProgress: (progress: number) => void;
};

export const uploadFile = (
  file: UploadableFile,
  config: MediaStoreConfig,
  callbacks?: Callbacks,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { content, collection } = file;
    const blobFile = new Blob([content]);
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
      blobFile,
      {
        hashingFunction: null as any, // TODO: Remove default hashingFunction from Chunkinator and put it here
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
        async onProgress(chunks) {
          console.log('onProgress', chunks);
          const id = await deferredUploadId;

          store.appendChunksToUpload(id, hashedChunks(chunks), chunkOffset);
          chunkOffset += chunks.length;

          if (callbacks && callbacks.onProgress) {
            callbacks.onProgress(0); // TODO: pass right percentage
          }
        },
      },
    );
  });
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
