jest.mock('../../util/getPreviewFromBlob');
jest.mock('../../util/getPreviewFromVideo');

import {
  ContextFactory,
  FileItem,
  AuthProvider,
  UploadFileCallbacks,
  MediaItemProvider,
  UploadFileResult,
} from '@atlaskit/media-core';
import { Observable } from 'rxjs/Observable';
import { MediaFile, UploadParams } from '../..';
import * as getPreviewModule from '../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../util/getPreviewFromVideo';
import { ExpFile, UploadService } from '../uploadService';
import {
  MockDragEvent,
  MockFile,
  MockFileList,
} from '../../util/clipboardEventMocks';

describe('UploadService', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const collection = 'some-collection';
  const clientBasedAuthProvider = () => Promise.resolve({ clientId, token });

  const getContext = (options = {}) =>
    ContextFactory.create({
      serviceHost: apiUrl,
      authProvider: clientBasedAuthProvider,
      ...options,
    });

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: new UploadService(getContext(), {
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

  const setupWithElement = () => {
    const uploadService = new UploadService(getContext(), {
      collection: '',
    });
    const element = document.createElement('input');

    jest.spyOn(element, 'addEventListener');
    jest.spyOn(element, 'removeEventListener');

    return {
      uploadService,
      element,
    };
  };

  describe('dropzone', () => {
    it('addDropzone should call addEventListener', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addDropzone(element);

      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('addDropzone should throw an exception when element added second time', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addDropzone(element);
      expect(() => {
        uploadService.addDropzone(element);
      }).toThrow();

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('removeDropzone should call removeEventListener', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addDropzone(element);
      uploadService.removeDropzone();

      expect(element.removeEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('removeDropzone should call removeEventListener only once if is called twice', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addDropzone(element);
      uploadService.removeDropzone();
      uploadService.removeDropzone();

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('removeDropzone should not call removeEventListener if the dropzone was not added', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.removeDropzone();

      expect(element.removeEventListener).not.toHaveBeenCalled();
    });

    it('addDropzone should call addEventListener if dropzone was added and removed before', () => {
      const { uploadService, element } = setupWithElement();
      const anotherElement = document.createElement('span');
      jest.spyOn(anotherElement, 'addEventListener');

      uploadService.addDropzone(element);
      uploadService.removeDropzone();
      uploadService.addDropzone(anotherElement);

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(anotherElement.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should call addFiles when file is dropped', () => {
      const uploadService = new UploadService(getContext(), {
        collection: '',
      });
      const element = document.createElement('div');
      uploadService.addDropzone(element);

      jest.spyOn(uploadService, 'addFiles');

      const files = [new MockFile(), new MockFile()];
      const clipBoardEvent = new MockDragEvent('drop', files);
      element.dispatchEvent(clipBoardEvent);

      expect(uploadService.addFiles).toHaveBeenCalledWith(files);
    });
  });

  describe('browse', () => {
    it('addBrowse should call addEventListener', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addBrowse(element);

      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('addBrowse should throw an exception when element added second time', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addBrowse(element);
      expect(() => {
        uploadService.addBrowse(element);
      }).toThrow();

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('removeBrowse should call removeEventListener', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addBrowse(element);
      uploadService.removeBrowse();

      expect(element.removeEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('removeBrowse should call removeEventListener only once if is called twice', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.addBrowse(element);
      uploadService.removeBrowse();
      uploadService.removeBrowse();

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('removeBrowse() should not call removeEventListener if the browse was not added', () => {
      const { uploadService, element } = setupWithElement();

      uploadService.removeBrowse();

      expect(element.removeEventListener).not.toHaveBeenCalled();
    });

    it('addBrowse should call addEventListener if dropzone was added and removed before', () => {
      const { uploadService, element } = setupWithElement();
      const anotherElement = document.createElement('input');
      jest.spyOn(anotherElement, 'addEventListener');

      uploadService.addBrowse(element);
      uploadService.removeBrowse();
      uploadService.addBrowse(anotherElement);

      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(anotherElement.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should call addFiles when file is selected', () => {
      const uploadService = new UploadService(getContext(), {
        collection: '',
      });
      const element = document.createElement('input');
      uploadService.addBrowse(element);

      jest.spyOn(uploadService, 'addFiles');

      const files = [new MockFile(), new MockFile()];
      const changeEvent = new Event('change');
      Object.defineProperty(element, 'files', {
        value: MockFileList.fromArray(files),
        writable: false,
      });
      element.dispatchEvent(changeEvent);

      expect(uploadService.addFiles).toHaveBeenCalledWith(files);
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
      const uploadService = new UploadService(getContext(), {
        collection: '',
      });

      const filesAddedPromise = new Promise(resolve =>
        uploadService.on('files-added', () => resolve()),
      );

      return { uploadService, filesAddedPromise };
    };

    it('should emit file upload event when file type is "image" and file size is less than 10 MB', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'image/png' };

      uploadService.addFiles([file as File]);

      await filesAddedPromise;
      expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledTimes(1);
    });

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

      expect(getPreviewFromVideo.getPreviewFromVideo).toHaveBeenCalledTimes(1);
      expect(getPreviewFromVideo.getPreviewFromVideo).toBeCalledWith(file);
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

    it('should not emit files-added if files is empty list', () => {
      const { uploadService } = setup();
      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);
      uploadService.addFiles([]);
      expect(filesAddedCallback).not.toHaveBeenCalled();
    });

    it('should emit files-added', () => {
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });
      jest.spyOn(context, 'uploadFile');
      uploadService.addFiles([file1, file2]);
      expect(context.uploadFile).toHaveBeenCalledTimes(2);
      expect(context.uploadFile).toHaveBeenCalledWith(
        {
          collection: 'some-collection',
          content: file1,
        },
        {
          onProgress: expect.any(Function),
        },
      );
      expect(context.uploadFile).toHaveBeenCalledWith(
        {
          collection: 'some-collection',
          content: file2,
        },
        {
          onProgress: expect.any(Function),
        },
      );
    });

    it('should emit file-converting when uploadFile resolves', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;
      const context = getContext();
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });
      const fileConvertingCallback = jest.fn();
      uploadService.on('file-converting', fileConvertingCallback);
      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: uploadFilePromise,
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });
      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);

      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: uploadFilePromise,
        cancel: jest.fn(),
      } as UploadFileResult);
      uploadService.addFiles([file]);
    });

    it('should call emit "file-uploading"', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const uploadFilePromise = Promise.resolve('public-file-id');
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: uploadFilePromise,
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      const uploadFilePromise = Promise.reject(new Error('Some reason'));
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: uploadFilePromise,
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const unresolvedPromise = new Promise<string>(() => {});
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: unresolvedPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);

      const generatedId = filesAddedCallback.mock.calls[0][0].files[0].id;
      uploadService.cancel(generatedId);
      expect(cancel).toHaveBeenCalled();
    });

    it('should not trigger error when cancelled', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      // This is how chunkinator rejects promised fileId
      const cancelledPromise = Promise.reject('canceled');
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: cancelledPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);
      try {
        await cancelledPromise;
      } catch (e) {}

      expect(fileUploadErrorCallback).not.toHaveBeenCalled();
    });

    it('should cancel all uploads', () => {
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const unresolvedPromise = new Promise<string>(() => {});
      const cancels = [jest.fn(), jest.fn()];
      let i = 0;
      jest.spyOn(context, 'uploadFile').mockImplementation(
        () =>
          ({
            promiseFileId: unresolvedPromise,
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const fileConvertedCallback = jest.fn();
      uploadService.on('file-converted', fileConvertedCallback);

      const resolvedPromise = Promise.resolve('some-id');
      const chunkinatorCancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: resolvedPromise,
        cancel: chunkinatorCancel,
      } as UploadFileResult);

      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create(observer => {
            // We have to wait 1 cycle otherwise :next callback called synchronously
            setImmediate(() => {
              // It's not required, but I like "natural" feel of this call
              observer.next(pendingFileItem);

              // At this point expFile.cancel should be the one that cancels pulling observable
              uploadService.cancel();
              // Just checking that original cancel method (that came from context.uploadFile)
              // is not called at this point
              expect(chunkinatorCancel).not.toHaveBeenCalled();
              expect(observer.closed).toBe(true);

              // Double checking that expFile was released
              expect(
                Object.keys((uploadService as any).uploadingExpFiles),
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

    it('should release expFile after files were added and succeeded status received', done => {
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
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const resolvedPromise = Promise.resolve('some-id');
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: resolvedPromise,
        cancel,
      } as UploadFileResult);

      const mediaItemProvider: MediaItemProvider = {
        observable: () =>
          Observable.create(observer => {
            setImmediate(() => {
              observer.next(succeededFileItem);
              expect(
                Object.keys((uploadService as any).uploadingExpFiles),
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
        Object.keys((uploadService as any).uploadingExpFiles),
      ).toHaveLength(1);
    });

    it('should release expFile after file failed to upload', async () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'video/mp4',
      } as any;

      const context = getContext();
      const uploadService = new UploadService(context, {
        collection: 'some-collection',
      });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      const rejectedPromise = Promise.reject(new Error('something happened'));
      const cancel = jest.fn();
      jest.spyOn(context, 'uploadFile').mockReturnValue({
        promiseFileId: rejectedPromise,
        cancel,
      } as UploadFileResult);

      uploadService.addFiles([file]);
      expect(
        Object.keys((uploadService as any).uploadingExpFiles),
      ).toHaveLength(1);
      try {
        await rejectedPromise;
      } catch (e) {}

      expect(
        Object.keys((uploadService as any).uploadingExpFiles),
      ).toHaveLength(0);
    });
  });

  describe('#copyFileToUsersCollection()', () => {
    const authProvider = jest.fn().mockReturnValue(Promise.resolve({}));

    const setup = (config: {
      uploadParams?: UploadParams;
      progress?: number;
      userAuthProvider?: AuthProvider;
      copyFileToCollectionSpy: Function;
    }) => {
      const collectionNameStub = 'some-collection-name';
      const context = getContext({
        authProvider,
        userAuthProvider: config.userAuthProvider,
      });
      const uploadService = new UploadService(context, {
        collection: collectionNameStub,
      });

      (uploadService as any).api = {
        copyFileToCollection: config.copyFileToCollectionSpy,
      };

      const sourceFileId = 'some-source-file-id';
      const sourceFileCollection = collectionNameStub;

      const expFile: ExpFile = {
        id: 'some-id-42',
        creationDate: 1234,
        file: {
          name: 'some-name',
          size: 4200,
          type: 'some-type',
        } as File,
      };

      return {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
        expFile,
      };
    };

    it('resolves immediately when userAuthProvider was not passed in to UploadService constructor', () => {
      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-upload-id'));

      const {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
        expFile,
      } = setup({
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        expFile,
        sourceFileCollection,
      ).then(() => {
        expect(authProvider).not.toHaveBeenCalled();
        expect(copyFileToCollectionSpy).not.toHaveBeenCalled();
      });
    });

    it('calls the authProvider with the sourceCollection', () => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider = () =>
        Promise.resolve({ clientId: usersClientId, token: usersToken });

      const copyFileToCollectionSpy = () => Promise.resolve('some-upload-id');

      const {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
      } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        {} as ExpFile,
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

      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const {
        uploadService,
        sourceFileId,
        sourceFileCollection,
        expFile,
      } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        expFile,
        sourceFileCollection,
      ).then(response => {
        expect(response).toEqual('some-MediaApi-response');
      });
    });

    it('rejects with api#copyFileToCollection rejection when userAuthProvider was passed into UploadService', () => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider = () =>
        Promise.resolve({ clientId: usersClientId, token: usersToken });

      const copyFileToCollectionRejection = new Error('some-error');
      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.reject(copyFileToCollectionRejection));

      const {
        uploadService,
        sourceFileId,
        sourceFileCollection,
        expFile,
      } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        expFile,
        sourceFileCollection,
      ).catch((error: Error) => {
        expect(error).toEqual(copyFileToCollectionRejection);
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
            name: 'upload_fail',
            description: 'some-error',
          },
        });
      });
    });

    it('resolves when userAuthProvider fails', () => {
      const userAuthProvider = () => Promise.reject(new Error('some-error'));

      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-MediaApi-response'));

      const {
        uploadService,
        sourceFileId,
        sourceFileCollection,
        expFile,
      } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        expFile,
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
