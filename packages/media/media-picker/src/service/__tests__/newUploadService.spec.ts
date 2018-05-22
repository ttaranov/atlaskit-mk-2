jest.mock('../../util/getPreviewFromBlob');
jest.mock('../../util/getPreviewFromVideo');

import {
  ContextFactory,
  FileItem,
  AuthProvider,
  UploadFileCallbacks,
  MediaItemProvider,
  UploadFileResult,
  ContextConfig,
  UploadableFile,
} from '@atlaskit/media-core';
import { fakeContext } from '@atlaskit/media-test-helpers';
import { Observable } from 'rxjs/Observable';
import { MediaFile, UploadParams } from '../..';
import * as getPreviewModule from '../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../util/getPreviewFromVideo';
import { UploadServiceFactory } from '../uploadServiceFactory';

describe('UploadService', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const collection = 'some-collection';

  const clientBasedAuthProvider = jest.fn(() =>
    Promise.resolve({ clientId, token }),
  );

  const getContext = (options = {}) =>
    ContextFactory.create({
      serviceHost: apiUrl,
      authProvider: clientBasedAuthProvider,
      ...options,
    });

  beforeEach(() => {
    clientBasedAuthProvider.mockClear();
  });

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: UploadServiceFactory.create(
        getContext(),
        {
          collection: '',
        },
        true,
      ),
    });

    it('should apply defaultUploadParams', () => {
      const { uploadService } = setup();

      uploadService.setUploadParams({});

      expect(uploadService['uploadParams']).toEqual({
        collection: '',
      });
    });

    it('should combine default uploadParams given new upload parameters', () => {
      const { uploadService } = setup();
      const newUploadParams: UploadParams = {
        collection,
      };

      uploadService.setUploadParams(newUploadParams);

      expect(uploadService['uploadParams']).toEqual({
        collection,
      });
    });
  });

  describe('addFiles', () => {
    beforeEach(() => {
      (getPreviewModule.getPreviewFromBlob as any).mockReset();
      (getPreviewFromVideo.getPreviewFromVideo as any).mockReset();
      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
        Promise.resolve(),
      );
      (getPreviewFromVideo.getPreviewFromVideo as any).mockReturnValue(
        Promise.resolve(),
      );
    });

    const setup = () => {
      const uploadService = UploadServiceFactory.create(
        getContext(),
        {
          collection: '',
        },
        true,
      );

      const filesAddedPromise = new Promise(resolve =>
        uploadService.on('files-added', () => resolve()),
      );

      return { uploadService, filesAddedPromise };
    };

    it('should NOT emit file upload event when file type is NOT "image"', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'unknown' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);

      await filesAddedPromise;
      expect(getPreviewModule.getPreviewFromBlob).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should NOT emit file upload event when file size is greater than 10MB', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 10e7, name: 'some-filename', type: 'image/png' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);

      await filesAddedPromise;
      expect(getPreviewModule.getPreviewFromBlob).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should emit file-preview-update for video files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      (getPreviewFromVideo.getPreviewFromVideo as any).mockReturnValue(
        Promise.resolve({ preview: true }),
      );

      uploadService.addFiles([file as File]);
      await filesAddedPromise;

      expect(callback).toHaveBeenCalledWith({
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'video/mp4',
        },
        preview: { preview: true },
      });
    });

    it('should emit file-preview-update for image files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'image/png' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
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
        },
        preview: { someImagePreview: true },
      });
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
      const file1: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      uploadService.addFiles([file1, file2]);
      expect(filesAddedCallback).toHaveBeenCalledWith({
        files: [
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
          },
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-other-filename',
            size: 100000000,
            type: 'image/png',
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

    it('should call uploadFile for each given file', () => {
      const file1: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );
      jest.spyOn(context, 'uploadFile');
      uploadService.addFiles([file1, file2]);
      expect(context.uploadFile).toHaveBeenCalledTimes(2);
      const expectedUploadableFile2: UploadableFile = {
        collection: 'some-collection',
        content: file2,
        name: 'some-other-filename',
        mimeType: 'image/png',
      };
      const expectedUploadableFile1: UploadableFile = {
        collection: 'some-collection',
        content: file1,
        name: 'some-filename',
        mimeType: 'video/mp4',
      };
      expect(context.uploadFile).toHaveBeenCalledWith(expectedUploadableFile1, {
        onProgress: expect.any(Function),
      });

      expect(context.uploadFile).toHaveBeenCalledWith(expectedUploadableFile2, {
        onProgress: expect.any(Function),
      });
    });

    it('should emit file-converting when uploadFile resolves', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );
      const fileConvertingCallback = jest.fn();
      uploadService.on('file-converting', fileConvertingCallback);
      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: uploadFilePromise,
        cancel: jest.fn(),
      } as UploadFileResult);
      uploadService.addFiles([file]);
      await uploadFilePromise;
      expect(fileConvertingCallback).toHaveBeenCalledWith({
        file: {
          publicId: 'public-file-id',
          id: expect.any(String),
          creationDate: expect.any(Number),
          name: 'some-filename',
          size: 100,
          type: 'video/mp4',
        },
      });
    });

    it('should emit file-converted when file is successfully processed', done => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
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
          Observable.create(observer => {
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
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );
      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);

      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: uploadFilePromise,
        cancel: jest.fn(),
      } as UploadFileResult);
      uploadService.addFiles([file]);
    });

    it('should call emit "file-uploading" when it receives an onProgress event from Context#uploadFile()', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: uploadFilePromise,
        cancel: jest.fn(),
      } as UploadFileResult);

      const fileUploadingCallback = jest.fn();
      uploadService.on('file-uploading', fileUploadingCallback);

      uploadService.addFiles([file]);
      const onProgress = ((context.uploadFile as jest.Mock<any>).mock
        .calls[0][1] as UploadFileCallbacks).onProgress;
      onProgress(0.42);
      const expectedMediaFile: MediaFile = {
        id: expect.any(String),
        creationDate: expect.any(Number),
        name: 'some-filename',
        size: 100,
        type: 'video/mp4',
      };
      expect(fileUploadingCallback).toHaveBeenCalledWith({
        file: expectedMediaFile,
        progress: expect.objectContaining({
          absolute: 42,
          max: 100,
          portion: 0.42,
        }),
      });
      await uploadFilePromise;
    });

    it('should emit "file-upload-error" when uploadFile fail', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      const uploadFilePromise = Promise.reject(new Error('Some reason'));
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: uploadFilePromise,
        cancel: jest.fn(),
      } as UploadFileResult);

      uploadService.addFiles([file]);
      await uploadFilePromise.catch(() => {});

      const expectedMediaFile: MediaFile = {
        id: expect.any(String),
        creationDate: expect.any(Number),
        name: 'some-filename',
        size: 100,
        type: 'video/mp4',
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
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const unresolvedPromise = new Promise<string>(() => {});
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: unresolvedPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);

      const generatedId = filesAddedCallback.mock.calls[0][0].files[0].id;
      uploadService.cancel(generatedId);
      expect(cancel).toHaveBeenCalled();
    });

    it('should not trigger error when cancelled', async () => {
      // Chunkinator rejects a promise when cancel is called.
      // With this test we want verify that this rejection doesn't cause error triggered
      // by uploadService.
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      // This is how chunkinator rejects promised fileId
      const cancelledPromise = Promise.reject('canceled');
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: cancelledPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);
      try {
        await cancelledPromise;
      } catch (e) {}

      expect(fileUploadErrorCallback).not.toHaveBeenCalled();
    });

    it('should cancel all uploads when #cancel is not passed any arguments', () => {
      const file1: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const unresolvedPromise = new Promise<string>(() => {});
      const cancels = [jest.fn(), jest.fn()];
      let i = 0;
      jest.spyOn(context, 'uploadFile').mockImplementation(
        () =>
          ({
            deferredFileId: unresolvedPromise,
            cancel: cancels[i++],
          } as UploadFileResult),
      );

      uploadService.addFiles([file1, file2]);

      uploadService.cancel();
      expect(cancels[0]).toHaveBeenCalled();
      expect(cancels[1]).toHaveBeenCalled();
    });

    it('should cancel status polling if file was already uploaded', done => {
      const file: File = {
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
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);

      const resolvedPromise = Promise.resolve('some-id');
      const chunkinatorCancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: resolvedPromise,
        cancel: chunkinatorCancel,
      } as UploadFileResult);

      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create(observer => {
            // We have to wait 1 cycle otherwise :next callback called synchronously
            setImmediate(() => {
              // It's not required, but I like "natural" feel of this call
              observer.next(pendingFileItem);

              // At this point cancellableFilesUpload.cancel should be the one that cancels polling observable
              uploadService.cancel();
              // Just checking that original cancel method (that came from context.uploadFile)
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

    it('should release cancellableFilesUpload after files were added and succeeded status received', done => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const succeededFileItem: FileItem = {
        type: 'file',
        details: {
          id: 'some-id',
          processingStatus: 'succeeded',
        },
      };

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const resolvedPromise = Promise.resolve('some-id');
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: resolvedPromise,
        cancel,
      } as UploadFileResult);

      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create(observer => {
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

    it('should release cancellableFilesUpload after file failed to upload', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: 'some-collection',
        },
        true,
      );

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const rejectedPromise = Promise.reject(new Error('something happened'));
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        deferredFileId: rejectedPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);
      expect(
        Object.keys((uploadService as any).cancellableFilesUploads),
      ).toHaveLength(1);
      try {
        await rejectedPromise;
      } catch (e) {}

      expect(
        Object.keys((uploadService as any).cancellableFilesUploads),
      ).toHaveLength(0);
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
      const collectionNameStub = 'some-collection-name';

      const clientBasedConfig: ContextConfig = {
        serviceHost: apiUrl,
        authProvider: clientBasedAuthProvider,
      };

      const context = fakeContext(
        {},
        { ...clientBasedConfig, userAuthProvider: config.userAuthProvider },
      );

      const uploadService = UploadServiceFactory.create(
        context,
        {
          collection: collectionNameStub,
        },
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

      const {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
      } = setup({
        copyFileWithTokenSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).then(() => {
        expect(authProvider).not.toHaveBeenCalled();
        expect(copyFileWithTokenSpy).not.toHaveBeenCalled();
      });
    });

    it('calls the authProvider with the sourceCollection', () => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider = () =>
        Promise.resolve({ clientId: usersClientId, token: usersToken });

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

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).then(() => {
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: sourceFileCollection,
        });
      });
    });

    it('resolves with api#copyFileToCollection response when userAuthProvider was passed into UploadService', () => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider = () =>
        Promise.resolve({ clientId: usersClientId, token: usersToken });

      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const { uploadService, sourceFileId, sourceFileCollection } = setup({
        userAuthProvider,
        copyFileWithTokenSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).then(response => {
        expect(response).toEqual('some-MediaApi-response');
      });
    });

    it('rejects with api#copyFileToCollection rejection when authProvider resolves', () => {
      const copyFileToCollectionRejection = new Error('some-error');
      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.reject(copyFileToCollectionRejection));

      const { uploadService, sourceFileId, sourceFileCollection } = setup({
        copyFileWithTokenSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).catch((error: Error) => {
        expect(error).toEqual(copyFileToCollectionRejection);
        expect(fileUploadErrorCallback).not.toHaveBeenCalled();
      });
    });

    it('resolves when userAuthProvider fails', () => {
      const userAuthProvider = () => Promise.reject(new Error('some-error'));

      const copyFileWithTokenSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const { uploadService, sourceFileId, sourceFileCollection } = setup({
        userAuthProvider,
        copyFileWithTokenSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).catch(error => {
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
      });
    });
  });
});
