import * as uuid from 'uuid';
import {
  Context,
  UploadableFile,
  MediaType,
  FileItem,
} from '@atlaskit/media-core';
import { EventEmitter2 } from 'eventemitter2';
import { defaultUploadParams } from '../domain/uploadParams';
import { MediaFile, PublicMediaFile, validateMediaFile } from '../domain/file';

import { MediaApi } from './mediaApi';
import { MediaClient } from './mediaClient';
import {
  mapAuthToSourceFileOwner,
  SourceFile,
} from '../popup/domain/source-file';
import { getPreviewFromBlob } from '../util/getPreviewFromBlob';
import { getPreviewFromVideo } from '../util/getPreviewFromVideo';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadParams,
} from '..';
import { SmartMediaProgress } from '../domain/progress';
import { MediaErrorName } from '../domain/error';

export interface ExpFile {
  id: string;
  creationDate: number;
  file: File;
  cancel?: Function;
}

export type UploadServiceEventPayloadTypes = {
  readonly 'files-added': UploadsStartEventPayload;
  readonly 'file-preview-update': UploadPreviewUpdateEventPayload;
  readonly 'file-uploading': UploadStatusUpdateEventPayload;
  readonly 'file-converting': UploadProcessingEventPayload;
  readonly 'file-converted': UploadEndEventPayload;
  readonly 'file-upload-error': UploadErrorEventPayload;
  readonly 'file-dropped': DragEvent;
};

export type UploadServiceEventListener<
  E extends keyof UploadServiceEventPayloadTypes
> = (payload: UploadServiceEventPayloadTypes[E]) => void;

const MAX_FILE_SIZE_FOR_PREVIEW = 10e6; // 10 MB

export class UploadService {
  private readonly context: Context;
  private readonly userCollectionMediaClient: MediaClient;
  private readonly api: MediaApi;

  private uploadParams: UploadParams;

  private readonly emitter: EventEmitter2;
  private dropzoneElement?: HTMLElement;
  private browserElement?: HTMLInputElement;
  private uploadingExpFiles: { [key: string]: ExpFile };

  constructor(context: Context, uploadParams?: UploadParams) {
    this.emitter = new EventEmitter2();
    this.context = context;
    this.uploadingExpFiles = {};

    if (context.config.userAuthProvider) {
      this.userCollectionMediaClient = new MediaClient(
        context.config.serviceHost,
        context.config.userAuthProvider,
        'recents',
      );
    }

    this.api = new MediaApi();

    this.setUploadParams(uploadParams);
  }

  setUploadParams(uploadParams?: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  addBrowse(element: HTMLInputElement): void {
    if (this.browserElement) {
      throw new Error(
        'Browse element was already assigned. call removeBrowse() first.',
      );
    }
    this.browserElement = element;
    this.browserElement.addEventListener('change', this.onFilePicked);
  }

  addDropzone(element: HTMLElement): void {
    if (this.dropzoneElement) {
      throw new Error(
        'Dropzone element was already assigned. call removeDropzone() first.',
      );
    }
    this.dropzoneElement = element;
    this.dropzoneElement.addEventListener('drop', this.onFileDropped);
  }

  removeDropzone() {
    if (!this.dropzoneElement) {
      return;
    }
    this.dropzoneElement.removeEventListener('drop', this.onFileDropped);
    delete this.dropzoneElement;
  }

  removeBrowse(): void {
    if (!this.browserElement) {
      return;
    }
    this.browserElement.removeEventListener('change', this.onFilePicked);
    delete this.browserElement;
  }

  // Browse listener
  private readonly onFilePicked = () => {
    if (this.browserElement) {
      const filesArray = Array.prototype.slice.call(this.browserElement.files);
      this.addFiles(filesArray);
    }
  };

  // Dropzone listener
  private readonly onFileDropped = (dragEvent: DragEvent) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.emit('file-dropped', dragEvent);

    const filesArray = Array.prototype.slice.call(dragEvent.dataTransfer.files);
    this.addFiles(filesArray);
  };

  addFiles(files: File[]): void {
    if (files.length === 0) {
      return;
    }
    const creationDate = Date.now();
    const expFiles: ExpFile[] = files.map(file => ({
      file,
      creationDate,
      id: uuid.v4(),
    }));

    const mediaFiles = expFiles.map(this.mapExpFileToMediaFile);

    this.emit('files-added', { files: mediaFiles });
    this.emitPreviews(expFiles);

    expFiles.forEach(expFile => {
      this.uploadingExpFiles[expFile.id] = expFile;
      const uploadableFile: UploadableFile = {
        collection: this.uploadParams.collection,
        content: expFile.file,
      };
      const { promiseFileId, cancel } = this.context.uploadFile(
        uploadableFile,
        {
          onProgress: this.onFileProgress.bind(this, expFile),
        },
      );
      expFile.cancel = cancel;
      promiseFileId.then(
        this.onFileSuccess.bind(this, expFile),
        this.onFileError.bind(this, expFile, 'upload_fail'),
      );
    });
  }

  cancel(id?: string): void {
    if (id) {
      const expFile = this.uploadingExpFiles[id];
      if (expFile && expFile.cancel) {
        expFile.cancel();
      }
    } else {
      Object.keys(this.uploadingExpFiles).forEach(key => {
        const expFile = this.uploadingExpFiles[key];
        if (expFile.cancel) {
          expFile.cancel();
        }
      });
    }
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

  private readonly emit = <E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    payload: UploadServiceEventPayloadTypes[E],
  ): void => {
    this.emitter.emit(event, payload);
  };

  private emitPreviews(expFiles: ExpFile[]) {
    expFiles.forEach(expFile => {
      const mediaFile = this.mapExpFileToMediaFile(expFile);
      const file = expFile.file;
      const { size } = file;
      const mediaType = this.getMediaTypeFromFile(file);
      if (size < MAX_FILE_SIZE_FOR_PREVIEW && mediaType === 'image') {
        getPreviewFromBlob(file, mediaType).then(preview => {
          this.emit('file-preview-update', {
            file: mediaFile,
            preview,
          });
        });
      } else if (mediaType === 'video') {
        getPreviewFromVideo(file).then(preview => {
          this.emit('file-preview-update', {
            file: mediaFile,
            preview,
          });
        });
      }
    });
  }

  private getMediaTypeFromFile(file: File): MediaType {
    const { type } = file;
    if (type.match(/^image\//)) {
      return 'image';
    } else if (type.match(/^video\//)) {
      return 'video';
    }

    return 'unknown';
  }

  private releaseExpFile(expFile: ExpFile): void {
    delete this.uploadingExpFiles[expFile.id];
  }

  private readonly onFileSuccess = (expFile: ExpFile, fileId: string) => {
    const collectionName = this.uploadParams.collection;
    this.copyFileToUsersCollection(fileId, expFile, collectionName);

    const publicMediaFile = this.mapExpFileToPublicMediaFile(expFile, fileId);
    this.emit('file-converting', {
      file: publicMediaFile,
    });

    const subscription = this.context
      .getMediaItemProvider(fileId, 'file', collectionName)
      .observable()
      .subscribe({
        next: (fileItem: FileItem) => {
          const fileDetails = fileItem.details;
          const { processingStatus } = fileDetails;

          if (
            processingStatus === 'succeeded' ||
            processingStatus === 'failed'
          ) {
            // TODO we emit 'file-converted' when it failed?
            this.emit('file-converted', {
              file: publicMediaFile,
              public: fileItem.details,
            });
            this.releaseExpFile(expFile);
          }
        },
        error: this.onFileError.bind(this, expFile, 'metadata_fetch_fail'),
      });

    expFile.cancel = () => {
      subscription.unsubscribe();
      this.releaseExpFile(expFile);
    };
  };

  private readonly onFileProgress = (expFile: ExpFile, portion: number) => {
    const size = expFile.file.size;
    const progress = new SmartMediaProgress(
      size,
      size * portion,
      expFile.creationDate,
      Date.now(),
    );

    this.emit('file-uploading', {
      file: this.mapExpFileToMediaFile(expFile),
      progress: progress.toJSON(),
    });
  };

  private readonly onFileError = (
    expFile: ExpFile,
    mediaErrorName: MediaErrorName,
    error: Error | any,
  ) => {
    this.releaseExpFile(expFile);
    if (error === 'canceled') {
      // Specific error coming from chunkinator via rejected fileId promise.
      // We do not want to trigger error in this case.
      return;
    }
    const description = (error && (error.message || error.toString())) || '';
    this.emit('file-upload-error', {
      file: this.mapExpFileToMediaFile(expFile),
      error: {
        fileId: expFile.id,
        description: description,
        name: mediaErrorName,
      },
    });
  };

  private copyFileToUsersCollection(
    sourceFileId: string,
    expFile: ExpFile,
    sourceCollection?: string,
  ): Promise<void> {
    if (!this.userCollectionMediaClient) {
      return Promise.resolve();
    }

    return this.context.config
      .authProvider({ collectionName: sourceCollection })
      .then(
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
        error => {
          this.onFileError(expFile, 'token_fetch_fail', error);
          throw error;
        },
      )
      .catch(error => {
        this.onFileError(expFile, 'upload_fail', error);
        throw error;
      });
  }

  private mapExpFileToPublicMediaFile = (
    expFile: ExpFile,
    publicId: string,
  ): PublicMediaFile => {
    return {
      ...this.mapExpFileToMediaFile(expFile),
      publicId,
    };
  };

  private mapExpFileToMediaFile = (expFile: ExpFile): MediaFile => {
    if (!expFile.creationDate) {
      throw new Error('createDate is required on file');
    }
    if (!expFile.id) {
      throw new Error('id is required file');
    }
    const mediaFile: MediaFile = {
      id: expFile.id,
      name: expFile.file.name,
      size: expFile.file.size,
      creationDate: expFile.creationDate,
      type: expFile.file.type,
    };

    validateMediaFile(mediaFile);

    return mediaFile;
  };
}
