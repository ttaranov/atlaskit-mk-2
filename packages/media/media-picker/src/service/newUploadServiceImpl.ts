import * as uuid from 'uuid';
import {
  Context,
  UploadableFile,
  MediaType,
  FileItem,
} from '@atlaskit/media-core';
import { MediaStore } from '@atlaskit/media-store';
import { EventEmitter2 } from 'eventemitter2';
import { defaultUploadParams } from '../domain/uploadParams';
import { MediaFile, PublicMediaFile } from '../domain/file';

import { mapAuthToSourceFileOwner } from '../popup/domain/source-file';
import { getPreviewFromBlob } from '../util/getPreviewFromBlob';
import { getPreviewFromVideo } from '../util/getPreviewFromVideo';
import { UploadParams } from '..';
import { SmartMediaProgress } from '../domain/progress';
import { MediaErrorName } from '../domain/error';
import {
  MAX_FILE_SIZE_FOR_PREVIEW,
  UploadService,
  UploadServiceEventListener,
  UploadServiceEventPayloadTypes,
} from './uploadServiceFactory';

export interface CancellableFileUpload {
  mediaFile: MediaFile;
  file: File;
  cancel?: () => void;
}

export class NewUploadServiceImpl implements UploadService {
  private readonly userMediaStore: MediaStore;

  private uploadParams: UploadParams;

  private readonly emitter: EventEmitter2;
  private dropzoneElement?: HTMLElement;
  private browserElement?: HTMLInputElement;
  private cancellableFilesUploads: { [key: string]: CancellableFileUpload };

  constructor(private readonly context: Context, uploadParams?: UploadParams) {
    this.emitter = new EventEmitter2();
    this.cancellableFilesUploads = {};

    if (context.config.userAuthProvider) {
      this.userMediaStore = new MediaStore({
        serviceHost: context.config.serviceHost,
        authProvider: context.config.userAuthProvider,
      });
    }

    this.setUploadParams(uploadParams);
  }

  setUploadParams(uploadParams?: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }

  // TODO addBrowse addDropzone removeDropzone removeBrowse are deprecated and going to be moved out
  // of this class as part of MSW-691
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
    const cancellableFileUploads: CancellableFileUpload[] = files.map(file => ({
      mediaFile: this.mapFileToMediaFile(file, uuid.v4(), creationDate),
      file,
    }));

    const mediaFiles = cancellableFileUploads.map(
      cancellableFileUpload => cancellableFileUpload.mediaFile,
    );

    this.emit('files-added', { files: mediaFiles });
    this.emitPreviews(cancellableFileUploads);

    cancellableFileUploads.forEach(cancellableFileUpload => {
      const { mediaFile, file } = cancellableFileUpload;
      this.cancellableFilesUploads[mediaFile.id] = cancellableFileUpload;
      const uploadableFile: UploadableFile = {
        collection: this.uploadParams.collection,
        content: file,
        name: file.name,
        mimeType: file.type,
      };
      const { deferredFileId, cancel } = this.context.uploadFile(
        uploadableFile,
        {
          onProgress: this.onFileProgress.bind(this, cancellableFileUpload),
        },
      );
      cancellableFileUpload.cancel = cancel;
      deferredFileId.then(
        this.onFileSuccess.bind(this, cancellableFileUpload),
        this.onFileError.bind(this, mediaFile, 'upload_fail'),
      );
    });
  }

  cancel(id?: string): void {
    if (id) {
      const cancellableFileUpload = this.cancellableFilesUploads[id];
      if (cancellableFileUpload && cancellableFileUpload.cancel) {
        cancellableFileUpload.cancel();
      }
    } else {
      Object.keys(this.cancellableFilesUploads).forEach(key => {
        const cancellableFileUpload = this.cancellableFilesUploads[key];
        if (cancellableFileUpload.cancel) {
          cancellableFileUpload.cancel();
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

  private emitPreviews(cancellableFileUploads: CancellableFileUpload[]) {
    cancellableFileUploads.forEach(cancellableFileUpload => {
      const { file, mediaFile } = cancellableFileUpload;
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

  private releaseCancellableFile(mediaFile: MediaFile): void {
    delete this.cancellableFilesUploads[mediaFile.id];
  }

  private readonly onFileSuccess = (
    cancellableFileUpload: CancellableFileUpload,
    fileId: string,
  ) => {
    const { mediaFile } = cancellableFileUpload;
    const collectionName = this.uploadParams.collection;
    this.copyFileToUsersCollection(fileId, collectionName).catch(console.log); // We intentionally swallow these errors

    const publicMediaFile: PublicMediaFile = {
      ...mediaFile,
      publicId: fileId,
    };

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
            this.emit('file-converted', {
              file: publicMediaFile,
              public: fileItem.details,
            });
            this.releaseCancellableFile(mediaFile);
          }
        },
        error: this.onFileError.bind(
          this,
          cancellableFileUpload,
          'metadata_fetch_fail',
        ),
      });

    cancellableFileUpload.cancel = () => {
      subscription.unsubscribe();
      this.releaseCancellableFile(mediaFile);
    };
  };

  private readonly onFileProgress = (
    { mediaFile, file }: CancellableFileUpload,
    portion: number,
  ) => {
    const size = file.size;
    const progress = new SmartMediaProgress(
      size,
      size * portion,
      mediaFile.creationDate,
      Date.now(),
    );

    this.emit('file-uploading', {
      file: mediaFile,
      progress: progress.toJSON(),
    });
  };

  private readonly onFileError = (
    mediaFile: MediaFile,
    mediaErrorName: MediaErrorName,
    error: Error | string,
  ) => {
    this.releaseCancellableFile(mediaFile);
    if (error === 'canceled') {
      // Specific error coming from chunkinator via rejected fileId promise.
      // We do not want to trigger error in this case.
      return;
    }
    const description = error instanceof Error ? error.message : error;
    this.emit('file-upload-error', {
      file: mediaFile,
      error: {
        fileId: mediaFile.id,
        description: description,
        name: mediaErrorName,
      },
    });
  };

  private copyFileToUsersCollection(
    sourceFileId: string,
    sourceCollection?: string,
  ): Promise<void> {
    if (!this.userMediaStore) {
      return Promise.resolve();
    }
    return this.context.config
      .authProvider({ collectionName: sourceCollection })
      .then(auth => {
        const body = {
          sourceFile: {
            id: sourceFileId,
            collection: sourceCollection,
            owner: {
              ...mapAuthToSourceFileOwner(auth),
            },
          },
        };
        const params = {
          collection: 'recents',
        };
        return this.userMediaStore.copyFileWithToken(body, params);
      });
  }

  private mapFileToMediaFile = (
    file: File,
    id: string,
    creationDate: number,
  ): MediaFile => ({
    id,
    name: file.name,
    size: file.size,
    creationDate,
    type: file.type,
  });
}
