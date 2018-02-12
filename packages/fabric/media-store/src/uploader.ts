import chunkinator, { Chunk } from 'chunkinator';
import { MediaStoreConfig, MediaStore } from './media-store';
// TODO: Extend Chunkinator with file: string | Blob
// TODO: Allow to pass multiple files
export type UploadableFile = {
  content: string | Blob;
  name?: string;
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
    const blobFile = new Blob([file.content]);
    const store = new MediaStore(config);
    const deferredUploadId = store
      .createUpload()
      .then(response => response.data[0].id);
    const uploadingFunction = (chunk: Chunk) => {
      return store.uploadChunk(chunk.hash, chunk.blob);
    };
    const probingFunction = (chunks: Chunk[]) => {
      return store.probeChunks(hashedChunks(chunks)).then(response => {
        const results = response.data.results;

        return (Object as any)
          .values(results)
          .map((result: any) => result.exists);
      });
    };
    let chunkOffset = 0;

    chunkinator(
      blobFile,
      {
        hashingFunction: null as any, // TODO: Remove default hashingFunction from Chunkinator and put it here
        hashingConcurrency: 3,
        probingBatchSize: 100,
        chunkSize: 4000000,
        uploadingConcurrency: 3,
        progressBatchSize: 100,
        uploadingFunction,
        probingFunction,
      },
      {
        onComplete() {
          deferredUploadId.then(id => {
            store.createFileFromUpload(id).then(response => {
              const fileId = response.data.id;
              resolve(fileId);
            });
          });
        },
        onError(error) {
          console.log('error', error);
          reject(error);
        },
        onProgress(chunks) {
          deferredUploadId.then(id => {
            store.appendChunksToUpload(id, hashedChunks(chunks), chunkOffset);
            chunkOffset += chunks.length;

            if (callbacks && callbacks.onProgress) {
              callbacks.onProgress(0); // TODO: pass right percentage
            }
          });
        },
      },
    );
  });
};

const hashedChunks = (chunks: Chunk[]) => chunks.map(chunk => chunk.hash);
