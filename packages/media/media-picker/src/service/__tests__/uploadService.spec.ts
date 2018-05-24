import { ResumableFile, ResumableChunk } from 'resumablejs';
import * as Resumable from 'resumablejs';
import { UploadParams } from '../../domain/config';
import { AuthProvider, ContextConfig } from '@atlaskit/media-core';
import { fakeContext } from '@atlaskit/media-test-helpers';
// Keep the order! It's important
import * as mediaStore from '@atlaskit/media-store';

const hasherHashSpy = jest.fn();
const createHasher = jest.spyOn(mediaStore, 'createHasher');
createHasher.mockReturnValue({ hash: hasherHashSpy });

import * as getPreviewModule from '../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../util/getPreviewFromVideo';
import { OldUploadServiceImpl as UploadService } from '../uploadService';

describe('UploadService', () => {
  const apiUrl = 'some-service-host';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';
  const collection = 'some-collection';

  const clientBasedAuthProvider = jest.fn(() =>
    Promise.resolve({ clientId, token }),
  );
  const issuerBasedAuthProvider = jest.fn(() =>
    Promise.resolve({ asapIssuer, token }),
  );

  const clientBasedConfig: ContextConfig = {
    serviceHost: apiUrl,
    authProvider: clientBasedAuthProvider,
  };
  const issuerBasedConfig: ContextConfig = {
    serviceHost: apiUrl,
    authProvider: issuerBasedAuthProvider,
  };

  beforeEach(() => {
    hasherHashSpy.mockReset();
    hasherHashSpy.mockReturnValue(Promise.resolve());
    clientBasedAuthProvider.mockClear();
    issuerBasedAuthProvider.mockClear();
  });

  describe('setUploadParams', () => {
    const setup = () => {
      const context = fakeContext();
      return {
        uploadService: new UploadService(context, {
          collection: '',
        }),
        context,
      };
    };

    it('should apply defaultUploadParams', () => {
      const { uploadService } = setup();

      uploadService.setUploadParams({});

      expect(uploadService.getUploadParams()).toEqual({
        collection: '',
      });
    });

    it('should combine default uploadParams given new upload parameters', () => {
      const { uploadService } = setup();
      const newUploadParams: UploadParams = {
        collection,
      };

      uploadService.setUploadParams(newUploadParams);

      expect(uploadService.getUploadParams()).toEqual({
        collection,
      });
    });
  });

  describe('dropzone', () => {
    const setup = () => {
      const context = fakeContext();
      const uploadService = new UploadService(context, {
        collection: '',
      });
      const resumable = uploadService['resumable'];
      const element = document.createElement('div');

      jest.spyOn(resumable, 'assignDrop');
      jest.spyOn(resumable, 'unAssignDrop');
      jest.spyOn(element, 'addEventListener');
      jest.spyOn(element, 'removeEventListener');

      return {
        uploadService,
        resumable,
        element,
        context,
      };
    };

    it('addDropzone should call addEventListener and assignDrop', () => {
      const { uploadService, resumable, element } = setup();

      uploadService.addDropzone(element);

      expect(resumable.assignDrop).toHaveBeenCalledTimes(1);
      expect(resumable.assignDrop).toHaveBeenCalledWith(element);
      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('addDropzone should not call addEventListener and assignDrop if dropzone was already added to same element', () => {
      const { uploadService, resumable, element } = setup();

      uploadService.addDropzone(element);
      uploadService.addDropzone(element);

      expect(resumable.assignDrop).toHaveBeenCalledTimes(1);
      expect(resumable.assignDrop).toHaveBeenCalledWith(element);
      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('addDropzone should not call addEventListener and assignDrop twice if dropzone was already added to another element', () => {
      const { uploadService, resumable, element } = setup();
      const otherElement = document.createElement('span');

      uploadService.addDropzone(otherElement);
      uploadService.addDropzone(element);

      expect(resumable.assignDrop).toHaveBeenCalledTimes(1);
      expect(resumable.assignDrop).toHaveBeenCalledWith(otherElement);
      expect(element.addEventListener).not.toHaveBeenCalled();
    });

    it('removeDropzone should call removeEventListener and unAssignDrop', () => {
      const { uploadService, resumable, element } = setup();

      uploadService.addDropzone(element);
      uploadService.removeDropzone();

      expect(resumable.unAssignDrop).toHaveBeenCalledTimes(1);
      expect(resumable.unAssignDrop).toHaveBeenCalledWith(element);
      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('removeDropzone should call removeEventListener and unAssignDrop only once if is called twice', () => {
      const { uploadService, resumable, element } = setup();

      uploadService.addDropzone(element);
      uploadService.removeDropzone();
      uploadService.removeDropzone();

      expect(resumable.unAssignDrop).toHaveBeenCalledTimes(1);
      expect(resumable.unAssignDrop).toHaveBeenCalledWith(element);
      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });

    it('removeDropzone should not call removeEventListener and unAssignDrop if the dropzone was not added', () => {
      const { uploadService, resumable, element } = setup();

      uploadService.removeDropzone();

      expect(resumable.unAssignDrop).not.toHaveBeenCalled();
      expect(element.addEventListener).not.toHaveBeenCalled();
    });

    it('addDropzone should call addEventListener and assignDrop if dropzone was added and removed before', () => {
      const { uploadService, resumable, element } = setup();
      const anotherElement = document.createElement('span');

      uploadService.addDropzone(anotherElement);
      uploadService.removeDropzone();
      uploadService.addDropzone(element);

      expect(resumable.assignDrop).toHaveBeenCalledTimes(2);
      expect(resumable.assignDrop).toHaveBeenCalledWith(anotherElement);
      expect(resumable.assignDrop).toHaveBeenLastCalledWith(element);
      expect(element.addEventListener).toHaveBeenCalled();
      expect(element.addEventListener).toBeCalledWith(
        'drop',
        expect.any(Function),
      );
    });
  });

  describe('cancel', () => {
    const setup = () => {
      const context = fakeContext();
      const uploadService = new UploadService(context, {
        collection: '',
      });
      const resumable = uploadService['resumable'];
      const resumableFile = {
        cancel: jest.fn(),
      };

      jest.spyOn(resumable, 'cancel');
      jest.spyOn(resumable, 'getFromUniqueIdentifier');

      return {
        uploadService,
        resumable,
        resumableFile,
        uniqueIdentifier: 'some-unique-identifier',
      };
    };

    it('should find resumable file by its unique id and call cancel if the file is found', () => {
      const {
        uploadService,
        resumable,
        resumableFile,
        uniqueIdentifier,
      } = setup();

      (resumable.getFromUniqueIdentifier as jest.Mock<
        ResumableFile | false
      >).mockReturnValue(resumableFile);

      uploadService.cancel(uniqueIdentifier);

      expect(resumable.getFromUniqueIdentifier).toBeCalledWith(
        uniqueIdentifier,
      );
      expect(resumableFile.cancel).toBeCalled();
    });

    it('should find resumable file by its unique id and do nothing if the file is not found', () => {
      const { uploadService, resumable, uniqueIdentifier } = setup();

      (resumable.getFromUniqueIdentifier as jest.Mock<
        ResumableFile | false
      >).mockReturnValue(false);

      uploadService.cancel(uniqueIdentifier);

      expect(resumable.getFromUniqueIdentifier).toBeCalledWith(
        uniqueIdentifier,
      );
    });

    it('should call cancel on resumable if unique id is not provided', () => {
      const { uploadService, resumable } = setup();

      uploadService.cancel();

      expect(resumable.cancel).toBeCalled();
    });
  });

  const setupForSpy = (
    isClientBasedAuth: boolean = true,
  ): Promise<Resumable> => {
    const context = fakeContext(
      {},
      isClientBasedAuth ? clientBasedConfig : issuerBasedConfig,
    );
    const uploadService = new UploadService(context, {
      collection: '',
    });
    const resumable: Resumable = uploadService['resumable'];

    const file = { size: 1000, type: 'image/png', name: 'some-file-name' };
    uploadService.addFiles([file as File]);
    resumable.upload();
    return new Promise(resolve => {
      resumable.on('uploadStart', () => resolve(resumable));
    });
  };

  describe('query', () => {
    it('should have client based auth parameters', () =>
      setupForSpy(true).then((resumable: Resumable) => {
        const queryResult = (resumable.opts.query as any)(
          resumable.files[0],
          resumable.files[0].chunks[0],
        );
        expect(queryResult).toEqual(
          expect.objectContaining({
            client: 'some-client-id',
            token: 'some-token',
          }),
        );
      }));

    it('should have issuer based auth parameters', () =>
      setupForSpy(false).then((resumable: Resumable) => {
        const queryResult = (resumable.opts.query as any)(
          resumable.files[0],
          resumable.files[0].chunks[0],
        );
        expect(queryResult).toEqual(
          expect.objectContaining({
            issuer: asapIssuer,
            token,
          }),
        );
      }));
  });

  describe('target', () => {
    it('should have client based auth parameters', () =>
      setupForSpy(true).then((resumable: Resumable) => {
        const rawParams: Array<string> = [
          `client=${clientId}`,
          `token=${token}`,
          'hash=some_hash',
          'resumableCurrentChunkSize=10',
        ];
        const url: string = (resumable.opts.target as any)(rawParams);
        expect(url).toEqual(
          `${apiUrl}/chunk/some_hash-10?client=${clientId}&token=${token}`,
        );
      }));

    it('should have issuer based auth parameters', () =>
      setupForSpy().then((resumable: Resumable) => {
        const rawParams: Array<string> = [
          `issuer=${asapIssuer}`,
          `token=${token}`,
          'hash=some_hash',
          'resumableCurrentChunkSize=10',
        ];
        const url: string = (resumable.opts.target as any)(rawParams);
        expect(url).toEqual(
          `${apiUrl}/chunk/some_hash-10?issuer=${asapIssuer}&token=${token}`,
        );
      }));
  });

  describe('add', () => {
    const setup = () => {
      (getPreviewModule.getPreviewFromBlob as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());
      (getPreviewFromVideo.getPreviewFromVideo as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());
      const context = fakeContext();
      const uploadService = new UploadService(context, {
        collection: '',
      });

      const resumable = uploadService['resumable'];

      const filesAddedPromise = new Promise(resolve =>
        uploadService.on('files-added', () => resolve()),
      );

      return { uploadService, resumable, filesAddedPromise };
    };

    it('should call createHasher once and its hash function twice for different UploadService instance', () => {
      const { uploadService: uploadService1, resumable: resumable1 } = setup();
      const { uploadService: uploadService2, resumable: resumable2 } = setup();

      const file = {
        size: 100,
        name: 'some-filename',
        type: '',
        slice: jest.fn(),
      };

      const promise1 = new Promise(resolve =>
        resumable1.on('filesAdded', () => resolve()),
      );
      const promise2 = new Promise(resolve =>
        resumable2.on('filesAdded', () => resolve()),
      );

      uploadService1.addFiles([file as any]);
      uploadService2.addFiles([file as any]);

      return Promise.all([promise1, promise2]).then(() => {
        expect(hasherHashSpy).toHaveBeenCalledTimes(2);
        expect(createHasher).toHaveBeenCalledTimes(1);
      });
    });

    it('should emit file upload event when file type is "image" and file size is less than 10 MB', () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'image/png' };

      uploadService.addFiles([file as File]);
      return filesAddedPromise.then(() => {
        expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledTimes(1);
      });
    });

    it('should NOT emit file upload event when file type is NOT "image"', () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'unknown' };

      uploadService.addFiles([file as File]);
      return filesAddedPromise.then(() => {
        expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledTimes(0);
      });
    });

    it('should NOT emit file upload event when file size is greater than 10MB', () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 10e7, name: 'some-filename', type: 'image/png' };

      uploadService.addFiles([file as File]);
      return filesAddedPromise.then(() => {
        expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledTimes(0);
      });
    });

    it('should emit file-preview-update for video files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

      uploadService.addFiles([file as File]);
      await filesAddedPromise;

      expect(getPreviewFromVideo.getPreviewFromVideo).toHaveBeenCalledTimes(1);
      expect(getPreviewFromVideo.getPreviewFromVideo).toBeCalledWith(file);
    });
  });

  describe('File events', () => {
    const setup = (
      config: { uploadParams?: UploadParams; progress?: number } = {},
    ) => {
      const context = fakeContext();
      const uploadService = new UploadService(
        context,
        config.uploadParams || { collection: '' },
      );
      const resumable = uploadService['resumable'];
      const emitter = uploadService['emitter'];
      const resumableFile = {
        uniqueIdentifier: 'some-unique-identifier',
        file: {
          name: 'some-file-name',
          size: 1000,
          type: 'jpg',
        },
        chunks: [] as ResumableChunk[],
        progress: jest.fn().mockReturnValue(config.progress),
      };

      jest.spyOn(uploadService as any, 'finalizeFile');
      jest.spyOn(uploadService as any, 'copyFileToUsersCollection');
      jest.spyOn(emitter, 'emit');
      jest.spyOn(resumable, 'upload');

      resumable.fire('filesAdded', [resumableFile] as any, '');

      return {
        uploadService,
        resumable,
        resumableFile,
        emitter,
      };
    };

    it('should emit "files-added" event', () => {
      const { emitter, resumableFile, uploadService } = setup({
        uploadParams: { collection },
      });

      return uploadService['mediaClientPool']
        .getMediaClient(collection)
        .refreshAuth()
        .then(() => {
          expect(emitter.emit).toBeCalledWith('files-added', {
            files: [
              expect.objectContaining({
                id: resumableFile.uniqueIdentifier,
                name: resumableFile.file.name,
              }),
            ],
          });
        });
    });

    it('should not fire "file-uploading" for file with undefined progress', () => {
      const { resumable, resumableFile, emitter } = setup();

      resumable.fire('fileProgress', resumableFile as any, '');

      expect(emitter.emit).not.toBeCalled();
    });

    it('should not fire "file-uploading" for file with zero progress', () => {
      const { resumable, resumableFile, emitter } = setup({ progress: 0 });

      resumable.fire('fileProgress', resumableFile as any, '');

      expect(emitter.emit).not.toBeCalled();
    });

    it('should not fire "file-uploading" for file with progress 1', () => {
      const { resumable, resumableFile, emitter } = setup({ progress: 1 });

      resumable.fire('fileProgress', resumableFile as any, '');

      expect(emitter.emit).not.toBeCalled();
    });

    it('should fire "file-uploading" for file with progress 0.4', () => {
      const { resumable, resumableFile, emitter } = setup({ progress: 0.4 });

      resumable.fire('fileProgress', resumableFile as any, '');

      expect(emitter.emit).toHaveBeenCalledTimes(1);
      expect(emitter.emit).toHaveBeenCalledWith(
        'file-uploading',
        expect.objectContaining({
          file: expect.objectContaining({
            name: resumableFile.file.name,
          }),
        }),
      );
    });

    it('should finalize file automatically', () => {
      const { uploadService, resumable, resumableFile, emitter } = setup({
        uploadParams: { collection },
      });

      resumable.fire('fileSuccess', resumableFile as any, '');

      expect(emitter.emit).toHaveBeenCalledTimes(1);
      expect(uploadService['finalizeFile']).toHaveBeenCalledTimes(1);
      expect(uploadService['finalizeFile']).toHaveBeenCalledWith(resumableFile);
    });

    it('should emit a 100% upload percentage when the file has been uploaded', () => {
      const { resumable, resumableFile, emitter } = setup({
        uploadParams: { collection },
      });

      resumable.fire('fileSuccess', resumableFile as any, '');

      expect(emitter.emit).toHaveBeenCalledTimes(1);
      expect(emitter.emit).toBeCalledWith(
        'file-uploading',
        expect.objectContaining({
          progress: expect.objectContaining({
            absolute: 1000,
            max: 1000,
            portion: 1,
          }),
        }),
      );
    });

    it('should fire "file-upload-error" with associated file and error', () => {
      console.error = jest.fn();
      const { resumable, resumableFile, emitter } = setup();
      const description = 'some-error-description';

      resumable.fire('fileError', resumableFile as any, description);

      expect(emitter.emit).toHaveBeenCalledTimes(1);
      expect(emitter.emit).toHaveBeenCalledWith(
        'file-upload-error',
        expect.objectContaining({
          file: expect.objectContaining({
            name: resumableFile.file.name,
          }),
          error: {
            fileId: resumableFile.uniqueIdentifier,
            name: 'upload_fail',
            description,
          },
        }),
      );
      expect(console.error).toBeCalled();
    });
  });

  describe('#finalizeFile()', () => {
    const setup = (
      config: { uploadParams?: UploadParams; progress?: number } = {},
    ) => {
      const collectionNameStub = 'some-collection-name';
      const context = fakeContext();
      const uploadService = new UploadService(
        context,
        config.uploadParams || { collection: collectionNameStub },
      );

      const resumable = uploadService['resumable'];
      const resumableFile: ResumableFile = {
        uniqueIdentifier: 'some-unique-identifier',
        file: {
          name: 'some-file-name',
        },
        chunks: [] as ResumableChunk[],
        progress: jest.fn().mockReturnValue(config.progress),
      } as any;

      jest.spyOn(uploadService as any, 'copyFileToUsersCollection');

      const publicFileIdStub = 'some-public-file-id';
      (uploadService as any).api = {
        createUpload: jest
          .fn()
          .mockReturnValue(Promise.resolve('some-upload-id')),
        createFileFromUpload: jest.fn().mockReturnValue(publicFileIdStub),
      };

      resumable.fire('filesAdded', [resumableFile] as any, '');
      return {
        uploadService,
        resumableFile,
        publicFileIdStub,
        collectionNameStub,
      };
    };

    it('calls #copyFileToUsersCollection when upload is added to tenants collection', () => {
      const {
        uploadService,
        resumableFile,
        publicFileIdStub,
        collectionNameStub,
      } = setup();

      return uploadService['finalizeFile'](resumableFile).then(() => {
        const copyFileToUsersCollectionSpy =
          uploadService['copyFileToUsersCollection'];
        expect(copyFileToUsersCollectionSpy).toHaveBeenCalledTimes(1);
        expect(copyFileToUsersCollectionSpy).toHaveBeenCalledWith(
          publicFileIdStub,
          collectionNameStub,
        );
      });
    });
  });

  describe('#copyFileToUsersCollection()', () => {
    const setup = (config: {
      uploadParams?: UploadParams;
      progress?: number;
      userAuthProvider?: AuthProvider;
      copyFileToCollectionSpy: Function;
    }) => {
      const collectionNameStub = 'some-collection-name';
      const context = fakeContext(
        {},
        {
          ...clientBasedConfig,
          userAuthProvider: config.userAuthProvider,
        },
      );
      const uploadService = new UploadService(
        context,
        config.uploadParams || { collection: collectionNameStub },
      );

      (uploadService as any).api = {
        copyFileToCollection: config.copyFileToCollectionSpy,
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
      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.resolve('some-upload-id'));

      const {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
      } = setup({
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
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

      const { uploadService, sourceFileId, sourceFileCollection } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).then(response => {
        expect(response).toEqual('some-MediaApi-response');
      });
    });

    it('rejects with api#copyFileToCollection rejection when userAuthProvider was passed into UploadService', done => {
      const usersClientId = 'some-users-collection-client-id';
      const usersToken = 'some-users-collection-client-id';
      const userAuthProvider = () =>
        Promise.resolve({ clientId: usersClientId, token: usersToken });

      const copyFileToCollectionRejection = new Error('some-error');
      const copyFileToCollectionSpy = jest
        .fn()
        .mockReturnValue(Promise.reject(copyFileToCollectionRejection));

      const { uploadService, sourceFileId, sourceFileCollection } = setup({
        userAuthProvider,
        copyFileToCollectionSpy,
      });

      return uploadService['copyFileToUsersCollection'](
        sourceFileId,
        sourceFileCollection,
      ).catch((error: Error) => {
        expect(error).toEqual(copyFileToCollectionRejection);
        done();
      });
    });
  });
});
