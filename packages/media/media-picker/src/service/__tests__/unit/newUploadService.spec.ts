jest.mock('../../../util/getPreviewFromBlob');
jest.mock('../../../util/getPreviewFromVideo');

import {
  ContextFactory,
  FileItem,
  AuthProvider,
  MediaItemProvider,
  ContextConfig,
  UploadableFile,
  Context,
  Auth,
} from '@atlaskit/media-core';
import { fakeContext } from '@atlaskit/media-test-helpers';
import { Observable } from 'rxjs/Observable';
import { MediaFile, UploadParams } from '../../..';
import * as getPreviewModule from '../../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../../util/getPreviewFromVideo';
import { UploadServiceFactory } from '../../uploadServiceFactory';

describe('UploadService', () => {
  const baseUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const collection = 'some-collection';

  const clientBasedAuthProvider = jest.fn(() =>
    Promise.resolve<Auth>({ clientId, token, baseUrl }),
  );

  const getContext = (options = {}) =>
    ContextFactory.create({
      authProvider: clientBasedAuthProvider,
      ...options,
    });

  const setup = (context: Context = getContext(), collection = '') => {
    jest.spyOn(context, 'uploadFile').mockReturnValue({
      subscribe() {},
    });

    const uploadService = UploadServiceFactory.create(context, {
      collection,
    });

    const filesAddedPromise = new Promise(resolve =>
      uploadService.on('files-added', () => resolve()),
    );

    return { uploadService, filesAddedPromise };
  };

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: UploadServiceFactory.create(getContext(), {
        collection: '',
      }),
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

    it('should NOT emit file upload event when file type is NOT "image"', async () => {
      const { uploadService } = setup();
      const file = { size: 100, name: 'some-filename', type: 'unknown' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);

      expect(getPreviewModule.getPreviewFromBlob).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should NOT emit file upload event when file size is greater than 10MB', async () => {
      const { uploadService } = setup();
      const file = { size: 10e7, name: 'some-filename', type: 'image/png' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);

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
      const uploadFile = jest.fn().mockReturnValue({
        subscribe() {},
      });
      (context as any).uploadFile = uploadFile;
      const { uploadService } = setup(context, 'some-collection');
      uploadService.addFiles([file1, file2]);
      expect(uploadFile).toHaveBeenCalledTimes(2);
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
      expect(uploadFile.mock.calls[0][0]).toEqual(expectedUploadableFile1);
      expect(uploadFile.mock.calls[1][0]).toEqual(expectedUploadableFile2);
    });

    it('should emit file-converting when uploadFile resolves', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const context = getContext();
      const { uploadService } = setup(context, 'some-collection');
      const fileConvertingCallback = jest.fn();
      uploadService.on('file-converting', fileConvertingCallback);
      jest.spyOn(context, 'uploadFile').mockReturnValue(
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
          },
        });
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
      const { uploadService } = setup(context, 'some-collection');
      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);
      jest.spyOn(context, 'uploadFile').mockReturnValue(
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

    it('should call emit "file-uploading" when it receives an onProgress event from Context#uploadFile()', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const { uploadService } = setup(context, 'some-collection');

      jest.spyOn(context, 'uploadFile').mockReturnValue({
        subscribe(subscription) {
          subscription.next({
            status: 'uploading',
            id: 'public-file-id',
            progress: 0.42,
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

    it('should emit "file-upload-error" when uploadFile fail', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const { uploadService } = setup(context, 'some-collection');

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      jest.spyOn(context, 'uploadFile').mockReturnValue({
        subscribe(subscription) {
          subscription.error('Some reason');
        },
      });

      uploadService.addFiles([file]);

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

    it('should cancel status polling if file was already uploaded', done => {
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

      jest.spyOn(context, 'uploadFile').mockReturnValue(
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

      jest.spyOn(context, 'uploadFile').mockReturnValue(
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

    it('should release cancellableFilesUpload after file failed to upload', () => {
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
        jest.spyOn(context, 'uploadFile').mockReturnValue({
          subscribe(subscription) {
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
      const collectionNameStub = 'some-collection-name';

      const clientBasedConfig: ContextConfig = {
        authProvider: clientBasedAuthProvider,
      };

      const context = fakeContext(
        {},
        { ...clientBasedConfig, userAuthProvider: config.userAuthProvider },
      );

      const uploadService = UploadServiceFactory.create(context, {
        collection: collectionNameStub,
      });

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
        expect(authProvider).toHaveBeenCalledTimes(1);
        expect(copyFileWithTokenSpy).not.toHaveBeenCalled();
      });
    });

    it('calls the authProvider with the sourceCollection', () => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider: AuthProvider = () =>
        Promise.resolve({
          clientId: usersClientId,
          token: usersToken,
          baseUrl,
        });

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
      const userAuthProvider: AuthProvider = () =>
        Promise.resolve({
          clientId: usersClientId,
          token: usersToken,
          baseUrl,
        });

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
