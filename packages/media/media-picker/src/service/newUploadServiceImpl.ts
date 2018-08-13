import * as uuid from 'uuid';
import {
  Context,
  UploadableFile,
  MediaType,
  FileDetails,
  getMediaTypeFromMimeType,
  ContextFactory,
  FileState,
} from '@atlaskit/media-core';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  UploadController,
} from '@atlaskit/media-store';
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
import { Observable } from 'rxjs/Observable';

export interface CancellableFileUpload {
  mediaFile: MediaFile;
  file: File;
  cancel?: () => void;
}

export class NewUploadServiceImpl implements UploadService {
  private readonly userMediaStore?: MediaStore;
  private readonly userContext?: Context;
  private readonly mediaStore: MediaStore;

  private uploadParams: UploadParams;
  private tenantUploadParams: UploadParams;

  private readonly emitter: EventEmitter2;
  private cancellableFilesUploads: { [key: string]: CancellableFileUpload };

  constructor(
    private readonly context: Context,
    tenantUploadParams: UploadParams,
    uploadParams?: UploadParams,
  ) {
    this.emitter = new EventEmitter2();
    this.cancellableFilesUploads = {};
    const { authProvider, userAuthProvider } = context.config;
    // We need a non user auth store, since we want to create the empty file in the public collection
    this.mediaStore = new MediaStore({
      authProvider,
    });

    if (userAuthProvider) {
      this.userMediaStore = new MediaStore({
        authProvider: userAuthProvider,
      });

      // We need to use the userAuth to upload this file (recents)
      this.userContext = ContextFactory.create({
        userAuthProvider,
        authProvider: userAuthProvider,
      });
    }

    this.tenantUploadParams = tenantUploadParams;

    this.setUploadParams(uploadParams);
  }

  setUploadParams(uploadParams?: UploadParams): void {
    this.uploadParams = {
      ...defaultUploadParams,
      ...uploadParams,
    };
  }
  // Used for testing
  private createUploadController(): UploadController {
    return new UploadController();
  }

  getUpfrontId = (observable?: Observable<FileState>): Promise<string> => {
    return new Promise<string>(async resolve => {
      const { shouldCopyFileToRecents } = this;

      if (shouldCopyFileToRecents && observable) {
        const subscrition = observable.subscribe({
          next: state => {
            resolve(state.id);
            subscrition.unsubscribe();
          },
        });
      } else {
        if (!this.userMediaStore) {
          return;
        }

        const occurrenceKey = uuid.v4();
        const { collection } = this.tenantUploadParams;
        const options = { collection, occurrenceKey };
        // We want to create an empty file in the public collection
        const response = await this.mediaStore.createFile(options);
        const id = response.data.id;

        resolve(id);
      }
    });
  };

  addFiles(files: File[]): void {
    if (files.length === 0) {
      return;
    }

    const creationDate = Date.now();
    const cancellableFileUploads: CancellableFileUpload[] = files.map(file => {
      const id = uuid.v4();
      const uploadableFile: UploadableFile = {
        collection: this.uploadParams.collection,
        content: file,
        name: file.name,
        mimeType: file.type,
      };
      const {
        userContext,
        context: tenantContext,
        shouldCopyFileToRecents,
      } = this;
      const controller = this.createUploadController();
      const context = shouldCopyFileToRecents ? tenantContext : userContext;
      let observable: Observable<FileState> | undefined;

      if (context) {
        observable = context.uploadFile(uploadableFile, controller);

        const subscrition = observable.subscribe({
          next: state => {
            if (state.status === 'uploading') {
              this.onFileProgress(cancellableFileUpload, state.progress);
            }

            if (state.status === 'processing') {
              subscrition.unsubscribe();

              this.onFileSuccess(cancellableFileUpload, state.id);
            }
          },
          error: error => {
            this.onFileError(mediaFile, 'upload_fail', error);
          },
        });
      }

      // TODO: Make this when pressing "insert"
      const upfrontId = this.getUpfrontId(observable);
      const mediaFile = {
        id,
        upfrontId,
        name: file.name,
        size: file.size,
        creationDate,
        type: file.type,
      };
      const cancellableFileUpload: CancellableFileUpload = {
        mediaFile,
        file,
        cancel: () => {
          // we can't do "cancellableFileUpload.cancel = controller.abort" because will change the "this" context
          controller.abort();
        },
      };
      this.cancellableFilesUploads[id] = cancellableFileUpload;

      return cancellableFileUpload;
    });

    const mediaFiles = cancellableFileUploads.map(
      cancellableFileUpload => cancellableFileUpload.mediaFile,
    );

    this.emit('files-added', { files: mediaFiles });
    this.emitPreviews(cancellableFileUploads);
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

    return getMediaTypeFromMimeType(type);
  }

  private releaseCancellableFile(mediaFile: MediaFile): void {
    delete this.cancellableFilesUploads[mediaFile.id];
  }

  private readonly onFileSuccess = async (
    cancellableFileUpload: CancellableFileUpload,
    fileId: string,
  ) => {
    const { mediaFile } = cancellableFileUpload;
    // TODO: do we need to do anything with the collectionName here?
    const { collection } = this.uploadParams;

    this.copyFileToUsersCollection(fileId, collection).catch(console.log); // We intentionally swallow these errors

    const publicMediaFile: PublicMediaFile = {
      ...mediaFile,
      publicId: fileId,
    };

    this.emit('file-converting', {
      file: publicMediaFile,
    });

    // TODO: fill extra available details? should we use this.context.getFile(publicId, {collectionName}) here?
    const details: FileDetails = {
      id: fileId,
    };

    this.emit('file-converted', {
      file: publicMediaFile,
      public: details,
    });

    cancellableFileUpload.cancel = () => {
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

  get shouldCopyFileToRecents(): boolean {
    const { copyFileToRecents } = this.uploadParams;

    return Boolean(copyFileToRecents);
  }

  private copyFileToUsersCollection(
    sourceFileId: string,
    sourceCollection?: string,
  ): Promise<void> {
    const { shouldCopyFileToRecents, userMediaStore } = this;

    if (!shouldCopyFileToRecents || !userMediaStore) {
      return Promise.resolve();
    }
    return this.context.config
      .authProvider({ collectionName: sourceCollection })
      .then(auth => {
        const body: MediaStoreCopyFileWithTokenBody = {
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

        return userMediaStore.copyFileWithToken(body, params);
      });
  }
}
