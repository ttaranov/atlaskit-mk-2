jest.mock('../../../util/getPreviewFromBlob');
jest.mock('../../../util/getPreviewFromImage');

import {
  ContextFactory,
  FileItem,
  AuthProvider,
  MediaItemProvider,
  ContextConfig,
  UploadableFile,
  Context,
  Auth,
  fileStreamsCache,
  FileState,
  MediaItem,
} from '@atlaskit/media-core';
import { fakeContext, nextTick } from '@atlaskit/media-test-helpers';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs';
import { NewUploadServiceImpl } from '../../newUploadServiceImpl';
import { MediaFile, UploadParams } from '../../..';
import * as getPreviewModule from '../../../util/getPreviewFromBlob';
import * as getPreviewFromImage from '../../../util/getPreviewFromImage';

const fileStreamCacheSpy = jest.spyOn(fileStreamsCache, 'set');

describe('UploadService', () => {
  const baseUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const upfrontId = Promise.resolve('1');
  const authProvider = jest.fn(() =>
    Promise.resolve<Auth>({ clientId, token, baseUrl }),
  );
  const usersClientId = 'some-users-collection-client-id';
  const usersToken = 'some-users-collection-client-id';
  const userAuthProvider: AuthProvider = () =>
    Promise.resolve({
      clientId: usersClientId,
      token: usersToken,
      baseUrl,
    });
  const getContext = (options = {}) =>
    ContextFactory.create({
      authProvider,
      ...options,
    });
  const file = { size: 100, name: 'some-filename', type: 'video/mp4' } as File;
  const setup = (
    context: Context = getContext(),
    tenantUploadParams: UploadParams = { collection: '' },
    shouldCopyFileToRecents: boolean = true,
  ) => {
    jest.spyOn(context.file, 'upload').mockReturnValue({
      subscribe() {},
    });

    const uploadService = new NewUploadServiceImpl(
      context,
      tenantUploadParams,
      shouldCopyFileToRecents,
    );
    const filesAddedPromise = new Promise(resolve =>
      uploadService.on('files-added', () => resolve()),
    );

    return { uploadService, filesAddedPromise, context };
  };

  beforeEach(() => {
    (getPreviewModule.getPreviewFromBlob as any).mockReset();
    (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
      Promise.resolve(),
    );
  });

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: new NewUploadServiceImpl(getContext(), {}, false),
    });

    it('should set new uploadParams', () => {
      const { uploadService } = setup();

      uploadService.setUploadParams({
        collection: 'new-collection',
      });

      expect(uploadService['tenantUploadParams']).toEqual({
        collection: 'new-collection',
      });
    });
  });

  describe('addFiles', () => {
    it('should emit file-preview-update for video files', async () => {
      const { uploadService, filesAddedPromise } = setup();

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file]);
      await filesAddedPromise;

      expect(callback).toHaveBeenCalledWith({
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'video/mp4',
          upfrontId,
          occurrenceKey: expect.any(String),
        },
      });
    });

    it('should emit file-preview-update for image files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'image/png' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      (getPreviewFromImage.getPreviewFromImage as any).mockReturnValue(
        Promise.resolve({ someImagePreview: true }),
      );

      uploadService.addFiles([file as File]);
      await filesAddedPromise;

      expect(callback).toHaveBeenCalledWith({
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'image/png',
          upfrontId,
          occurrenceKey: expect.any(String),
        },
        preview: { someImagePreview: true },
      });
    });

    it('should use getPreviewFromBlob for non-image files when emitting preview', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
        Promise.resolve({ someImagePreview: true }),
      );

      uploadService.addFiles([file as File]);
      await filesAddedPromise;

      expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledWith(
        file,
        'video',
      );
    });

    it('should not emit files-added if files is empty list', () => {
      const { uploadService } = setup();
      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);
      uploadService.addFiles([]);
      expect(filesAddedCallback).not.toHaveBeenCalled();
    });

    it('should emit files-added event with correct payload when addFiles() is called with multiple files', () => {
      const { uploadService } = setup();
      const currentTimestamp = Date.now();
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      uploadService.addFiles([file, file2]);
      expect(filesAddedCallback).toHaveBeenCalledWith({
        files: [
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
            upfrontId,
            occurrenceKey: expect.any(String),
          },
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-other-filename',
            size: 100000000,
            type: 'image/png',
            upfrontId,
            occurrenceKey: expect.any(String),
          },
        ],
      });
      expect(filesAddedCallback.mock.calls[0][0].files[0].id).not.toEqual(
        filesAddedCallback.mock.calls[0][0].files[1].id,
      );
      expect(
        filesAddedCallback.mock.calls[0][0].files[0].creationDate,
      ).toBeGreaterThanOrEqual(currentTimestamp);
      expect(
        filesAddedCallback.mock.calls[0][0].files[1].creationDate,
      ).toBeGreaterThanOrEqual(currentTimestamp);
    });

    it('should call upload for each given file', () => {
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;
      const context = getContext();
      const uploadFile = jest.fn().mockReturnValue({
        subscribe() {},
      });
      (context as any).file = { upload: uploadFile };
      const { uploadService } = setup(context, {
        collection: 'some-collection',
      });
      uploadService.addFiles([file, file2]);
      expect(uploadFile).toHaveBeenCalledTimes(2);
      const expectedUploadableFile2: UploadableFile = {
        collection: 'some-collection',
        content: file2,
        name: 'some-other-filename',
        mimeType: 'image/png',
      };
      const expectedUploadableFile1: UploadableFile = {
        collection: 'some-collection',
        content: file,
        name: 'some-filename',
        mimeType: 'video/mp4',
      };
      expect(uploadFile.mock.calls[0][0]).toEqual(expectedUploadableFile1);
      expect(uploadFile.mock.calls[1][0]).toEqual(expectedUploadableFile2);
    });

    it.skip('should emit file-converting when uploadFile resolves', async () => {
      const context = getContext();
      const { uploadService } = setup(context, {
        collection: 'some-collection',
      });
      const fileConvertingCallback = jest.fn();
      uploadService.on('file-converting', fileConvertingCallback);
      jest.spyOn(context.file, 'upload').mockReturnValue(
        new Observable(observer => {
          setImmediate(() => {
            observer.next({
              status: 'processing',
              id: 'public-file-id',
            });
          });
        }),
      );
      uploadService.addFiles([file]);
      setImmediate(() => {
        expect(fileConvertingCallback).toHaveBeenCalledTimes(1);
        expect(fileConvertingCallback).toHaveBeenCalledWith({
          file: {
            publicId: 'public-file-id',
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
            upfrontId,
          },
        });
      });
    });

    it.skip('should emit file-converted when file is successfully processed', done => {
      const context = getContext();
      const pendingFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'pending',
        },
      };
      const succeededFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'succeeded',
        },
      };
      const failedFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'failed',
        },
      };
      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create((observer: Subscriber<MediaItem>) => {
            observer.next(pendingFileItem);
            expect(fileConvertedCallback).not.toHaveBeenCalled();
            observer.next(succeededFileItem);
            const expectedFile = {
              publicId: 'public-file-id',
              id: expect.any(String),
              creationDate: expect.any(Number),
              name: 'some-filename',
              size: 100,
              type: 'video/mp4',
            };
            expect(fileConvertedCallback).toHaveBeenCalledWith({
              file: expectedFile,
              public: {
                id: 'some-id',
                processingStatus: 'succeeded',
              },
            });
            observer.next(failedFileItem);
            expect(fileConvertedCallback).toHaveBeenCalledWith({
              file: expectedFile,
              public: {
                id: 'some-id',
                processingStatus: 'failed',
              },
            });
            done();
          }),
      };

      jest
        .spyOn(context, 'getMediaItemProvider')
        .mockReturnValue(mediaItemProvider);
      const { uploadService } = setup(context, {
        collection: 'some-collection',
      });
      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);
      jest.spyOn(context.file, 'upload').mockReturnValue(
        new Observable(observer => {
          setImmediate(() => {
            observer.next({
              status: 'processing',
              id: 'public-file-id',
            });
          });
        }),
      );
      uploadService.addFiles([file]);
    });

    it.skip('should call emit "file-uploading" when it receives an onProgress event from Context.file#upload()', () => {
      const context = getContext();
      const { uploadService } = setup(context, {
        collection: 'some-collection',
      });

      jest.spyOn(context.file, 'upload').mockReturnValue({
        subscribe(subscription: Subscriber<FileState>) {
          subscription.next({
            status: 'uploading',
            id: 'public-file-id',
            name: 'some-file-name',
            size: 100,
            progress: 0.42,
            mediaType: 'image',
            mimeType: 'image/png',
          });
        },
      });

      const fileUploadingCallback = jest.fn();
      uploadService.on('file-uploading', fileUploadingCallback);

      uploadService.addFiles([file]);
      const expectedMediaFile: MediaFile = {
        id: expect.any(String),
        creationDate: expect.any(Number),
        name: 'some-filename',
        size: 100,
        type: 'video/mp4',
        upfrontId,
      };
      expect(fileUploadingCallback).toHaveBeenCalledWith({
        file: expectedMediaFile,
        progress: expect.objectContaining({
          absolute: 42,
          max: 100,
          portion: 0.42,
        }),
      });
    });

    it.skip('should emit "file-upload-error" when uploadFile fail', () => {
      const context = getContext();
      const { uploadService } = setup(context, {
        collection: 'some-collection',
      });
      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      jest.spyOn(context.file, 'upload').mockReturnValue({
        subscribe(subscription: Subscriber<FileState>) {
          // setTimeout(() => {
          subscription.error('Some reason');
          // }, 10)
        },
      });

      uploadService.addFiles([file]);

      const expectedMediaFile: MediaFile = {
        id: expect.any(String),
        creationDate: expect.any(Number),
        name: 'some-filename',
        size: 100,
        type: 'video/mp4',
        upfrontId,
      };
      expect(fileUploadErrorCallback).toHaveBeenCalledWith({
        file: expectedMediaFile,
        error: {
          fileId: expect.any(String),
          name: 'upload_fail',
          description: 'Some reason',
        },
      });
    });
  });

  describe('#cancel()', () => {
    it('should cancel specific upload', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;
      const { uploadService } = setup();
      const abort = jest.fn();
      (uploadService as any).createUploadController = () => ({ abort });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      uploadService.addFiles([file]);

      const generatedId = filesAddedCallback.mock.calls[0][0].files[0].id;
      uploadService.cancel(generatedId);
      expect(abort).toHaveBeenCalled();
    });

    it('should cancel all uploads when #cancel is not passed any arguments', () => {
      const file1: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;
      const { uploadService } = setup();
      const createUploadController = jest.fn().mockReturnValue({ abort() {} });
      (uploadService as any).createUploadController = createUploadController;

      const filesAddedCallback = jest.fn();

      uploadService.on('files-added', filesAddedCallback);
      uploadService.addFiles([file1, file2]);
      uploadService.cancel();
      expect(createUploadController).toHaveBeenCalledTimes(2);
    });

    it.skip('should cancel status polling if file was already uploaded', done => {
      const file = {
        size: 100,
        name: 'some-filename',
        type: 'some-type',
      } as any;

      const pendingFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'pending',
        },
      };

      const succeededFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'succeeded',
        },
      };

      const context = getContext();
      const { uploadService } = setup(context);

      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);
      const chunkinatorCancel = jest.fn();

      jest.spyOn(context.file, 'upload').mockReturnValue(
        new Observable(observer => {
          setImmediate(() => {
            observer.next({
              status: 'processing',
              id: 'some-id',
            });
          });
        }),
      );
      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create((observer: Subscriber<MediaItem>) => {
            // We have to wait 1 cycle otherwise :next callback called synchronously
            setImmediate(() => {
              // It's not required, but I like "natural" feel of this call
              observer.next(pendingFileItem);

              // At this point cancellableFilesUpload.cancel should be the one that cancels polling observable
              uploadService.cancel();
              // Just checking that original cancel method (that came from context.file.upload)
              // is not called at this point
              expect(chunkinatorCancel).not.toHaveBeenCalled();
              expect(observer.closed).toBe(true);

              // Double checking that cancellableFilesUpload was released
              expect(
                Object.keys((uploadService as any).cancellableFilesUploads),
              ).toHaveLength(0);

              // Just checking that `file-converted` event is not triggered even if .next be called
              observer.next(succeededFileItem);
              expect(fileConvertedCallback).not.toHaveBeenCalled();
              done();
            });
          }),
      };

      jest
        .spyOn(context, 'getMediaItemProvider')
        .mockReturnValue(mediaItemProvider);

      uploadService.addFiles([file]);
    });

    it.skip('should release cancellableFilesUpload after files were added and succeeded status received', done => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;

      const succeededFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'succeeded',
        },
      };

      const context = getContext();
      const { uploadService } = setup(context);

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      jest.spyOn(context.file, 'upload').mockReturnValue(
        new Observable(observer => {
          setImmediate(() => {
            observer.next({
              status: 'processing',
            });
          });
        }),
      );

      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create((observer: Subscriber<MediaItem>) => {
            setImmediate(() => {
              observer.next(succeededFileItem);
              expect(
                Object.keys((uploadService as any).cancellableFilesUploads),
              ).toHaveLength(0);
              done();
            });
          }),
      };

      jest
        .spyOn(context, 'getMediaItemProvider')
        .mockReturnValue(mediaItemProvider);

      uploadService.addFiles([file]);
      expect(
        Object.keys((uploadService as any).cancellableFilesUploads),
      ).toHaveLength(1);
    });

    it.skip('should release cancellableFilesUpload after file failed to upload', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;

      const context = getContext();
      const { uploadService } = setup(context);

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      return new Promise(resolve => {
        jest.spyOn(context.file, 'upload').mockReturnValue({
          subscribe(subscription: Subscriber<FileState>) {
            subscription.error();
            expect(
              Object.keys((uploadService as any).cancellableFilesUploads),
            ).toHaveLength(0);
            resolve();
          },
        });

        uploadService.addFiles([file]);
        expect(
          Object.keys((uploadService as any).cancellableFilesUploads),
        ).toHaveLength(1);
      });
    });
  });

  // TODO it seems quite strange that we are testing a private method here. (MSW-691)
  // we should tease this out into a separate module/class
  describe('#copyFileToUsersCollection()', () => {
    const setup = (config: {
      uploadParams?: UploadParams;
      progress?: number;
      userAuthProvider?: AuthProvider;
      copyFileWithTokenSpy: Function;
    }) => {
      const clientBasedConfig: ContextConfig = {
        authProvider,
      };

      const context = fakeContext(
        {},
        { ...clientBasedConfig, userAuthProvider: config.userAuthProvider },
      );

      const collectionNameStub = 'some-collection-name';
      const uploadService = new NewUploadServiceImpl(
        context,
        { collection: collectionNameStub },
        true,
      );
      (uploadService as any).userMediaStore = config.userAuthProvider && {
        copyFileWithToken: config.copyFileWithTokenSpy,
      };

      const sourceFileId = 'some-source-file-id';
      return {
        uploadService,
        authProvider: context.config.authProvider,
        sourceFileId,
        sourceFileCollection: collectionNameStub,
      };
    };

    it('resolves immediately when userAuthProvider was not passed in to UploadService constructor', () => {
      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-upload-id'));

      const { uploadService, sourceFileId } = setup({
        copyFileWithTokenSpy,
      });

      return uploadService['copyFileToUsersCollection'](sourceFileId).then(
        () => {
          expect(copyFileWithTokenSpy).not.toHaveBeenCalled();
        },
      );
    });

    it('calls the authProvider with the sourceCollection', () => {
      const copyFileWithTokenSpy = () => Promise.resolve('some-upload-id');
      const {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
      } = setup({
        userAuthProvider,
        copyFileWithTokenSpy,
      });

      return uploadService['copyFileToUsersCollection'](sourceFileId).then(
        () => {
          expect(authProvider).toHaveBeenCalledWith({
            collectionName: sourceFileCollection,
          });
        },
      );
    });

    it('resolves with api#copyFileToCollection response when userAuthProvider was passed into UploadService', () => {
      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const { uploadService, sourceFileId } = setup({
        userAuthProvider,
        copyFileWithTokenSpy,
      });

      return uploadService['copyFileToUsersCollection'](sourceFileId).then(
        response => {
          expect(response).toEqual('some-MediaApi-response');
        },
      );
    });

    it('rejects with api#copyFileToCollection rejection when authProvider resolves', () => {
      const copyFileToCollectionRejection = new Error('some-error');
      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.reject(copyFileToCollectionRejection));

      const { uploadService, sourceFileId } = setup({
        copyFileWithTokenSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](sourceFileId).catch(
        (error: Error) => {
          expect(error).toEqual(copyFileToCollectionRejection);
          expect(fileUploadErrorCallback).not.toHaveBeenCalled();
        },
      );
    });

    it('resolves when userAuthProvider fails', () => {
      const userAuthProvider = () => Promise.reject(new Error('some-error'));

      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const { uploadService, sourceFileId } = setup({
        userAuthProvider,
        copyFileWithTokenSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](sourceFileId).catch(
        error => {
          expect(error).toEqual(new Error('some-error'));
          expect(fileUploadErrorCallback).toHaveBeenCalledWith({
            file: {
              id: 'some-id-42',
              creationDate: 1234,
              name: 'some-name',
              size: 4200,
              type: 'some-type',
            },
            error: {
              fileId: 'some-id-42',
              name: 'token_fetch_fail',
              description: 'some-error',
            },
          });
        },
      );
    });
  });

  describe('upfront id', () => {
    it('should use tenantContext context to upload file when shouldCopyFileToRecents=true', () => {
      const { uploadService, context } = setup(undefined, undefined, true);

      uploadService.addFiles([file]);
      expect(context.file.upload).toHaveBeenCalledTimes(1);
    });

    it('should use userContext context to upload file when shouldCopyFileToRecents=false', () => {
      const context = getContext({ userAuthProvider });
      const { uploadService } = setup(context, {}, false);
      const userContextUpload = jest.spyOn(
        (uploadService as any)['userContext'].file,
        'upload',
      );
      uploadService.addFiles([file]);
      expect(userContextUpload).toHaveBeenCalledTimes(1);
    });

    it('should populate fileStreamsCache once we have the upfront id', async () => {
      const { uploadService } = setup(undefined, {
        collection: 'some-collection',
      });
      const getUpfrontId = jest.fn().mockReturnValue(Promise.resolve('1234'));

      (uploadService as any).getUpfrontId = getUpfrontId;
      uploadService.addFiles([file]);

      await nextTick();

      expect(fileStreamCacheSpy).toHaveBeenCalledTimes(2);
      expect(fileStreamCacheSpy.mock.calls[0][0]).toBe('1234');
      expect(fileStreamCacheSpy.mock.calls[1][0]).toBe('1234-some-collection');
    });
  });

  describe('getUpfrontId()', () => {
    it('should create an empty file on the tenant when shouldCopyFileToRecents=false', async () => {
      const context = getContext({ userAuthProvider });
      const { uploadService } = setup(context, {}, false);
      const createFileSpy = jest
        .spyOn((uploadService as any).tenantMediaStore, 'createFile')
        .mockReturnValue({
          data: {
            id: '12',
          },
        });
      const id = await (uploadService as any).getUpfrontId(
        undefined,
        'occurrenceKey-1',
      );

      expect(createFileSpy).toHaveBeenCalledTimes(1);
      expect(createFileSpy).lastCalledWith({
        collection: undefined,
        occurrenceKey: 'occurrenceKey-1',
      });
      expect(id).toEqual('12');
    });
  });
});
