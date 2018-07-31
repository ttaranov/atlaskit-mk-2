/**
 * TODO
 * This is deprecated code. It will be removed soon (MSW-691)
 * Please remove this file and rename newUploadServiceImpl.ts to uploadServiceImpl.ts
 */
import * as Resumable from 'resumablejs';
import * as uuid from 'uuid';
import { EventEmitter2 } from 'eventemitter2';
import { ResumableFile, ResumableChunk } from 'resumablejs';
import {
  AuthProvider,
  MediaType,
  getMediaTypeFromMimeType,
} from '@atlaskit/media-core';
import { createHasher } from '@atlaskit/media-store';
import { Context, FileDetails } from '@atlaskit/media-core';
import { handleError } from '../util/handleError';
import { sliceByChunks } from '../util/sliceByChunks';
import { getPreviewFromBlob } from '../util/getPreviewFromBlob';
import { getPreviewFromVideo } from '../util/getPreviewFromVideo';
import { mapAuthToQueryParameters } from '../domain/auth';
import { MediaErrorName } from '../domain/error';
import { SmartMediaProgress } from '../domain/progress';
import { defaultUploadParams } from '../domain/uploadParams';
import { MediaFile, PublicMediaFile, UploadParams } from '..';

import { MediaClient, MediaApiError, isTokenError } from './mediaClient';
import { MediaClientPool } from './mediaClientPool';
import { MediaApi } from './mediaApi';
import {
  SourceFile,
  mapAuthToSourceFileOwner,
} from '../popup/domain/source-file';
import {
  UploadService,
  UploadServiceEventListener,
  UploadServiceEventPayloadTypes,
} from './uploadServiceFactory';

type UploadId = string;
type ChunkId = string;

const MAX_RETRY_COUNT = 1;

interface ClientBasedUploadQueryParameters {
  hash: string;
  client: string;
  token: string;
}

interface AsapBasedUploadQueryParameters {
  hash: string;
  issuer: string;
  token: string;
}

type UploadQueryParameters =
  | ClientBasedUploadQueryParameters
  | AsapBasedUploadQueryParameters;

interface Upload {
  readonly creationDate: number;
  readonly uploadParams: UploadParams;
}

export class OldUploadServiceImpl implements UploadService {
  private static hasher = createHasher();

  private resumableInstance?: Resumable;
  private uploadChunkUrl?: string;

  private readonly emitter: EventEmitter2;
  private readonly mediaClientPool: MediaClientPool;
  private readonly authProvider: AuthProvider;
  private readonly userCollectionMediaClient: MediaClient;
  private readonly api: MediaApi;
  private readonly uploads: { [uniqueIdentifier: string]: Upload } = {};

  private uploadParams: UploadParams;
  private retry: number = 0;

  constructor(context: Context, uploadParams?: UploadParams) {
    const authProvider = context.config.authProvider;
    const userAuthProvider = context.config.userAuthProvider;

    this.emitter = new EventEmitter2();
    this.api = new MediaApi();
    this.authProvider = authProvider;

    this.mediaClientPool = new MediaClientPool(authProvider);
    if (userAuthProvider) {
      this.userCollectionMediaClient = new MediaClient(
        userAuthProvider,
        'recents',
      );
    }

    this.setUploadParams(uploadParams);

    this.authProvider().then(({ baseUrl }) => {
      this.resumableInstance = new Resumable({
        target: this.generateTarget,
        uploadMethod: 'PUT',
        testMethod: 'HEAD',
        chunkSize: 4 * 1024 * 1024,
        chunkRetryInterval: 2500,
        maxChunkRetries: 5,
        simultaneousUploads: 3,
        forceChunkSize: true,
        permanentErrors: [400, 403, 404, 415, 500, 501],
        method: 'octet',
        minFileSize: 0,
        query: this.getQueryParameters,
        preprocess: chunk => this.hashResumableChunk(chunk),
        generateUniqueIdentifier: () => uuid.v4(),
      });

      this.resumableInstance.on('filesAdded', this.onFilesAdded);
      this.resumableInstance.on('chunkingComplete', this.onChunkingComplete);
      this.resumableInstance.on('fileProgress', this.onFileProgress);
      this.resumableInstance.on('fileSuccess', this.onFileSuccess);
      this.resumableInstance.on('fileError', this.onFileError);

      this.uploadChunkUrl = `${baseUrl}/chunk`;
      this.emitter.emit('resumable-is-ready');
    });
  }

  get resumable(): Promise<Resumable> {
    if (this.resumableInstance) {
      return Promise.resolve(this.resumableInstance);
    } else {
      return new Promise(resolve => {
        this.emitter.once('resumable-is-ready', () => {
          resolve(this.resumableInstance);
        });
      });
    }
  }

  setUploadParams(uploadParams?: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  getUploadParams(): UploadParams {
    // for testing
    return this.uploadParams;
  }

  addFiles(files: File[]): void {
    this.resumable.then(resumable =>
      files.forEach(file => resumable.addFile(file)),
    );
  }

  cancel(uniqueIdentifier?: string): void {
    this.resumable.then(resumable => {
      if (uniqueIdentifier) {
        const resumableFile = resumable.getFromUniqueIdentifier(
          uniqueIdentifier,
        );
        if (resumableFile) {
          resumableFile.cancel();
        }
      } else {
        resumable.cancel();
      }
    });
  }

  on<E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    listener: UploadServiceEventListener<E>,
  ): void {
    this.emitter.on(event, listener);
  }

  off<E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    listener: UploadServiceEventListener<E>,
  ): void {
    this.emitter.off(event, listener);
  }

  private emit = <E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    payload: UploadServiceEventPayloadTypes[E],
  ): void => {
    this.emitter.emit(event, payload);
  };

  private getMediaClient(resumableFile: ResumableFile): MediaClient {
    const { collection } = this.getResumableFileUploadParams(resumableFile);
    return this.mediaClientPool.getMediaClient(collection);
  }

  // Returns query parameters for a chunk
  private getQueryParameters = (
    file: ResumableFile,
    chunk: ResumableChunk,
  ): UploadQueryParameters => {
    const mediaClient = this.getMediaClient(file);
    const { storedAuth } = mediaClient;

    if (storedAuth) {
      return {
        hash: (chunk as any).hash,
        ...mapAuthToQueryParameters(storedAuth),
      };
    } else {
      throw new Error('auth required');
    }
  };

  // Hasher API has changed, so we need some glue
  private hashResumableChunk(chunk) {
    const { file } = chunk.fileObj;
    const chunkBlob = file.slice(chunk.startByte, chunk.endByte);

    OldUploadServiceImpl.hasher.hash(chunkBlob).then(
      hash => {
        chunk.hash = hash;
        chunk.preprocessFinished();
      },
      error => {
        this.onError(chunk, 'upload_fail', error);
      },
    );
  }

  // Generates URL to upload a chunk
  private generateTarget = (rawParams: Array<string>): string => {
    // Resumablejs reports parameters as an array of strings: [ 'key=value', ... ]
    // We convert it to an object { key: value }
    const params = rawParams.map(p => p.split('=')).reduce(
      (obj, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {} as any,
    );

    const { hash, resumableCurrentChunkSize, client, issuer, token } = params;
    let authQueryParameters;
    if (issuer) {
      authQueryParameters = `issuer=${issuer}&token=${token}`;
    } else {
      authQueryParameters = `client=${client}&token=${token}`;
    }

    return `${
      this.uploadChunkUrl
    }/${hash}-${resumableCurrentChunkSize}?${authQueryParameters}`;
  };

  // Handling events from resumable

  private onFilesAdded = (resumableFiles: Array<ResumableFile>): void => {
    if (resumableFiles.length === 0) {
      return;
    }

    const { uploadParams } = this;

    resumableFiles.forEach(resumableFile => {
      this.uploads[resumableFile.uniqueIdentifier] = {
        creationDate: Date.now(),
        uploadParams,
      };
    });

    // ResumableJS needs a valid token to make calls. It makes calls by itself, without using MediaClient.
    // To make sure that MediaClient stores a valid token, we refresh it before upload starts.
    const { collection } = uploadParams;
    const mediaClient = this.mediaClientPool.getMediaClient(collection);
    const maxFileSizeForPreview = 10e6; // 10 MB

    mediaClient.refreshAuth().then(
      () => {
        this.retry = 0;

        const files = resumableFiles.map(resumableFile => {
          const file = this.mapResumableFileToMediaFile(resumableFile);
          const mediaType = this.getMediaTypeFromFile(resumableFile.file);
          // TODO MSW-396 Replace this check after RFC from ticket has been decided
          // https://product-fabric.atlassian.net/browse/MSW-396
          if (file.size < maxFileSizeForPreview && mediaType === 'image') {
            getPreviewFromBlob(resumableFile.file, mediaType).then(preview => {
              this.emit('file-preview-update', {
                file,
                preview,
              });
            });
          } else if (mediaType === 'video') {
            getPreviewFromVideo(resumableFile.file).then(preview => {
              this.emit('file-preview-update', {
                file,
                preview,
              });
            });
          }

          return file;
        });

        this.emit('files-added', { files });

        this.resumable.then(resumable => resumable.upload());
      },
      () => {
        resumableFiles.forEach(resumableFile =>
          this.onError(resumableFile, 'token_fetch_fail'),
        );
        resumableFiles.forEach(resumableFile => resumableFile.cancel());
        resumableFiles.forEach(this.cleanupResumableFile);
      },
    );
  };

  private getMediaTypeFromFile(file: File): MediaType {
    const { type } = file;

    return getMediaTypeFromMimeType(type);
  }

  private onChunkingComplete = (resumableFile: ResumableFile): void => {
    // By default the callback of a chunk aborts all uploads and clears the chunk array in case of error.
    //
    // To prevent this and allow token refresh logic we patch the chunk callback.
    resumableFile.chunks.forEach(chunk => {
      const oldCallback = chunk.callback;

      chunk.callback = (event, message) => {
        if (event === 'error') {
          this.retry++;

          resumableFile.abort();
          resumableFile.pause(true);
          this.resumable.then(resumable =>
            resumable.fire('fileError', resumableFile, message || ''),
          );
          return;
        }

        if (event === 'success') {
          this.retry = 0;
        }

        oldCallback(event, message);
      };
    });
  };

  private onFileProgress = (resumableFile: ResumableFile): void => {
    const portion = resumableFile.progress();
    const file = this.mapResumableFileToMediaFile(resumableFile);

    if (portion > 0 && portion < 1) {
      const progress = new SmartMediaProgress(
        file.size,
        file.size * portion,
        file.creationDate,
        Date.now(),
      );

      this.emit('file-uploading', {
        file,
        progress,
      });
    }
  };

  private emitLastUploadingPercentage = (resumableFile: ResumableFile) => {
    const file = this.mapResumableFileToMediaFile(resumableFile);
    const progress = new SmartMediaProgress(
      file.size,
      file.size,
      file.creationDate,
      Date.now(),
    );

    this.emit('file-uploading', {
      file,
      progress,
    });
  };

  private onFileSuccess = (resumableFile: ResumableFile): void => {
    this.emitLastUploadingPercentage(resumableFile);

    this.finalizeFile(resumableFile);
  };

  private onFileError = (
    resumableFile: ResumableFile,
    message: string,
  ): void => {
    const mediaClient = this.getMediaClient(resumableFile);

    this.onUploadError(resumableFile, 'upload_fail', message, mediaClient)
      .then(() => {
        // Retry to upload the file
        resumableFile._prevProgress = 0;
        resumableFile.pause(false);
        resumableFile.chunks.forEach(chunk => {
          if (chunk.status() === 'error') {
            chunk.preprocessState = 0;
            chunk.send();
          }

          if (chunk.status() === 'pending' && chunk.preprocessState === 2) {
            chunk.preprocessState = 0;
          }
        });
      })
      .catch(() => {
        resumableFile.cancel();
      });
  };

  // Finalizing a file

  private finalizeFile(resumableFile: ResumableFile): Promise<void> {
    const { fileName, file } = resumableFile;
    const { collection } = this.getResumableFileUploadParams(resumableFile);

    const maxChunks = 1000;
    const chunks = resumableFile.chunks.map(chunk => {
      const { hash, endByte, startByte } = chunk as any;
      return hash + '-' + (endByte - startByte);
    });

    const mediaClient = this.getMediaClient(resumableFile);

    return this.api
      .createUpload(mediaClient)
      .then(uploadId =>
        this.appendChunksToUpload(mediaClient, uploadId, chunks, maxChunks),
      )
      .then(uploadId =>
        this.api.createFileFromUpload(
          mediaClient,
          fileName,
          file.type,
          uploadId,
          collection,
        ),
      )
      .then(fileId => {
        this.copyFileToUsersCollection(fileId, collection).catch(console.error);

        return this.processFile(mediaClient, fileId, resumableFile);
      })
      .catch(error => {
        this.onError(resumableFile, 'object_create_fail', error);
      });
  }

  private appendChunksToUpload(
    mediaClient: MediaClient,
    uploadId: UploadId,
    allChunkIds: Array<ChunkId>,
    maxChunks: number,
  ): Promise<UploadId> {
    return sliceByChunks(allChunkIds, maxChunks)
      .map((someChunkIds, index) => {
        const offset = index * maxChunks;
        return () =>
          this.api.appendChunksToUpload(
            mediaClient,
            uploadId,
            someChunkIds,
            offset,
          );
      })
      .reduce((promise, current) => {
        return promise.then(current);
      }, Promise.resolve())
      .then(() => uploadId);
  }

  private copyFileToUsersCollection(
    sourceFileId: string,
    sourceCollection?: string,
  ): Promise<void> {
    if (!this.userCollectionMediaClient) {
      return Promise.resolve();
    }

    return this.authProvider({ collectionName: sourceCollection }).then(
      auth => {
        const sourceFile: SourceFile = {
          id: sourceFileId,
          collection: sourceCollection,
          owner: {
            ...mapAuthToSourceFileOwner(auth),
          },
        };

        return this.api.copyFileToCollection(
          this.userCollectionMediaClient,
          sourceFile,
          'recents',
        );
      },
    );
  }

  private processFile(
    mediaClient: MediaClient,
    fileId: string,
    resumableFile: ResumableFile,
  ): Promise<void> {
    return this.pollForFileMetadata(mediaClient, fileId, resumableFile)
      .then(metadata => {
        const file = this.mapResumableFileToPublicMediaFile(
          resumableFile,
          metadata.id,
        );

        this.emit('file-converted', {
          file,
          public: metadata,
        });
      })
      .catch(error => {
        this.onError(resumableFile, 'metadata_fetch_fail', error);
      });
  }

  private pollForFileMetadata(
    mediaClient: MediaClient,
    publicId: string,
    resumableFile: ResumableFile,
  ): Promise<FileDetails> {
    const { collection } = this.getResumableFileUploadParams(resumableFile);

    this.emit('file-converting', {
      file: this.mapResumableFileToPublicMediaFile(resumableFile, publicId),
    });
    return this.api.pollForFileMetadata(mediaClient, publicId, collection);
  }

  // Error handling

  private onUploadError(
    resumableFile: ResumableFile,
    errorName: MediaErrorName,
    errorDetails: string,
    mediaClient: MediaClient,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const uploadId = resumableFile.uniqueIdentifier;
      // Try to read error from error details
      let error: MediaApiError | undefined;
      try {
        error = JSON.parse(errorDetails);
      } catch (ignored) {}

      if (isTokenError(error) && this.retry <= MAX_RETRY_COUNT) {
        mediaClient
          .refreshAuth()
          .then(() => resolve())
          .catch(() => {
            this.emit('file-upload-error', {
              file: this.mapResumableFileToMediaFile(resumableFile),
              error: {
                fileId: uploadId,
                name: 'token_update_fail',
                description: errorDetails,
              },
            });
            handleError(errorName, errorDetails);
            reject();
          });
        return;
      }

      if (error && error.error && error.error.title) {
        errorDetails = error.error.title;
      }

      this.emit('file-upload-error', {
        file: this.mapResumableFileToMediaFile(resumableFile),
        error: {
          fileId: uploadId,
          name: errorName,
          description: errorDetails,
        },
      });
      handleError(errorName, errorDetails);
      reject();
    });
  }

  private onError(
    resumableFile: ResumableFile,
    errorName: MediaErrorName,
    error?: any,
  ): void {
    let errorDetails: string;
    if (error && error.error && error.error.title) {
      errorDetails = error.error.title;
    } else {
      errorDetails = JSON.stringify(error || {});
    }

    this.emit('file-upload-error', {
      file: this.mapResumableFileToMediaFile(resumableFile),
      error: {
        fileId: resumableFile.uniqueIdentifier,
        name: errorName,
        description: errorDetails,
      },
    });
    handleError(errorName, errorDetails);
  }

  private mapResumableFileToMediaFile = (
    resumableFile: ResumableFile,
  ): MediaFile => {
    const file = {
      id: resumableFile.uniqueIdentifier,
      name: resumableFile.file.name,
      size: resumableFile.file.size,
      type: resumableFile.file.type,
      creationDate: this.getResumableFileCreationDate(resumableFile),
    };

    return file;
  };

  private mapResumableFileToPublicMediaFile = (
    resumableFile: ResumableFile,
    publicId: string,
  ): PublicMediaFile => {
    return {
      ...this.mapResumableFileToMediaFile(resumableFile),
      publicId,
    };
  };

  private getResumableFileCreationDate = (
    resumableFile: ResumableFile,
  ): number => {
    return this.uploads[resumableFile.uniqueIdentifier].creationDate;
  };

  private getResumableFileUploadParams = (
    resumableFile: ResumableFile,
  ): UploadParams => {
    return this.uploads[resumableFile.uniqueIdentifier].uploadParams;
  };

  private cleanupResumableFile = (resumableFile: ResumableFile): void => {
    delete this.uploads[resumableFile.uniqueIdentifier];
  };
}
