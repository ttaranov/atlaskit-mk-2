import * as uuid from 'uuid';
import {
  Context,
  UploadableFile,
  MediaType,
  FileDetails,
  getMediaTypeFromMimeType,
  ContextFactory,
  FileState,
  FileStreamCache,
  fileStreamsCache,
} from '@atlaskit/media-core';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  UploadController,
  MediaStoreCopyFileWithTokenParams,
  MediaStoreResponse,
  MediaFile as MediaStoreMediaFile,
} from '@atlaskit/media-store';
import { EventEmitter2 } from 'eventemitter2';
import { MediaFile, PublicMediaFile } from '../domain/file';

import { RECENTS_COLLECTION } from '../popup/config';
import { mapAuthToSourceFileOwner } from '../popup/domain/source-file';
import { getPreviewFromImage } from '../util/getPreviewFromImage';
import { getPreviewFromVideo } from '../util/getPreviewFromVideo';
import { UploadParams } from '..';
import { SmartMediaProgress } from '../domain/progress';
import { MediaErrorName } from '../domain/error';
import {
  MAX_FILE_SIZE_FOR_PREVIEW,
  UploadService,
  UploadServiceEventListener,
  UploadServiceEventPayloadTypes,
} from './types';
import { Observable } from 'rxjs/Observable';

export interface CancellableFileUpload {
  mediaFile: MediaFile;
  file: File;
  cancel?: () => void;
}

export class NewUploadServiceImpl implements UploadService {
  private readonly userMediaStore?: MediaStore;
  private readonly tenantMediaStore: MediaStore;
  private readonly userContext?: Context;
  private readonly emitter: EventEmitter2;
  private cancellableFilesUploads: { [key: string]: CancellableFileUpload };

  constructor(
    private readonly tenantContext: Context,
    private tenantUploadParams: UploadParams,
    private readonly shouldCopyFileToRecents: boolean,
  ) {
    this.emitter = new EventEmitter2();
    this.cancellableFilesUploads = {};
    const {
      authProvider: tenantAuthProvider,
      userAuthProvider,
    } = tenantContext.config;
    // We need a non user auth store, since we want to create the empty file in the public collection
    this.tenantMediaStore = new MediaStore({
      authProvider: tenantAuthProvider,
    });

    // TODO Would be nice to have two contexts: tenant and user ones
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
  }

  setUploadParams(uploadParams: UploadParams): void {
    this.tenantUploadParams = uploadParams;
  }

  // Used for testing
  private createUploadController(): UploadController {
    return new UploadController();
  }

  getUpfrontId = (
    observable?: Observable<FileState>,
    occurrenceKey?: string,
  ): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      const { shouldCopyFileToRecents } = this;

      if (shouldCopyFileToRecents && observable) {
        const subscrition = observable.subscribe({
          next: state => {
            resolve(state.id);
            subscrition.unsubscribe();
          },
        });
      } else if (this.userMediaStore) {
        const { collection } = this.tenantUploadParams;
        const options = { collection, occurrenceKey };
        // We want to create an empty file in the tenant collection
        const response = await this.tenantMediaStore.createFile(options);
        const id = response.data.id;

        resolve(id);
      } else {
        reject();
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
      const { userContext, tenantContext, shouldCopyFileToRecents } = this;
      const uploadableFile: UploadableFile = {
        collection: shouldCopyFileToRecents
          ? this.tenantUploadParams.collection
          : RECENTS_COLLECTION,
        content: file,
        name: file.name,
        mimeType: file.type,
      };
      const context = shouldCopyFileToRecents ? tenantContext : userContext;

      const controller = this.createUploadController();
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

      const occurrenceKey = uuid.v4();
      const upfrontId = this.getUpfrontId(observable, occurrenceKey);
      const mediaFile: MediaFile = {
        id,
        upfrontId,
        name: file.name,
        size: file.size,
        creationDate,
        type: file.type,
        occurrenceKey,
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
      // Save observable in the cache
      upfrontId.then(id => {
        if (context && observable) {
          const key = FileStreamCache.createKey(id);
          fileStreamsCache.set(key, observable);
        }
      });

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
        getPreviewFromImage(file).then(preview => {
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

    this.copyFileToUsersCollection(fileId)
      // tslint:disable-next-line:no-console
      .catch(console.log); // We intentionally swallow these errors

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

  // This method copies the file from the "tenant collection" to the "user collection" (recents).
  // that means we need "tenant auth" as input and "user auth" as output
  private copyFileToUsersCollection(
    sourceFileId: string,
  ): Promise<MediaStoreResponse<MediaStoreMediaFile> | void> {
    const {
      shouldCopyFileToRecents,
      userMediaStore,
      tenantUploadParams,
    } = this;
    if (!shouldCopyFileToRecents || !userMediaStore) {
      return Promise.resolve();
    }
    const { collection: sourceCollection } = tenantUploadParams;
    return this.tenantContext.config
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
        const params: MediaStoreCopyFileWithTokenParams = {
          collection: RECENTS_COLLECTION,
        };

        return userMediaStore.copyFileWithToken(body, params);
      });
  }
}
