import { Hasher } from '../hashing/hasher';
import * as hasherCreatorModule from '../hashing/hasherCreator';
import { UploadParams } from '../../domain/config';

// We need this mocking to happen before importing uploadService
const createHasher = hasherCreatorModule.createHasher;
const createHasherSpy = jest.spyOn(hasherCreatorModule, 'createHasher');
let hasherHashSpy: jest.SpyInstance<Hasher['hash']>;

createHasherSpy.mockImplementation(() => {
  const hasher = createHasher();
  hasherHashSpy = jest.spyOn(hasher, 'hash');
  return hasher;
});

import * as getPreviewModule from '../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../util/getPreviewFromVideo';
import { UploadService } from '../uploadService';
import { AuthProvider } from '@atlaskit/media-core';

describe('UploadService', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const clientBasedAuthProvider = () => Promise.resolve({ clientId, token });

  beforeEach(() => {
    hasherHashSpy.mockReset();
  });

  describe('dropzone', () => {
    const setup = () => {
      const uploadService = new UploadService(apiUrl, clientBasedAuthProvider, {
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

  describe('add', () => {
    const setup = () => {
      (getPreviewModule.getPreviewFromBlob as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());
      (getPreviewFromVideo.getPreviewFromVideo as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const uploadService = new UploadService(apiUrl, clientBasedAuthProvider, {
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

      const file = { size: 100, name: 'some-filename', type: '' };

      const promise1 = new Promise(resolve =>
        resumable1.on('filesAdded', () => resolve()),
      );
      const promise2 = new Promise(resolve =>
        resumable2.on('filesAdded', () => resolve()),
      );

      uploadService1.addFiles([file as File]);
      uploadService2.addFiles([file as File]);

      return Promise.all([promise1, promise2]).then(() => {
        expect(hasherHashSpy).toHaveBeenCalledTimes(2);
        expect(createHasherSpy).toHaveBeenCalledTimes(1);
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
    it('should emit "files-added" event', () => {
      // TODO this test
    });

    it('should not fire "file-uploading" for file with undefined progress', () => {
      // TODO this test
    });

    it('should not fire "file-uploading" for file with zero progress', () => {
      // TODO this test
    });

    it('should not fire "file-uploading" for file with progress 1', () => {
      // TODO this test
    });

    it('should fire "file-uploading" for file with progress 0.4', () => {
      // TODO this test
    });

    it('should finalize file automatically', () => {
      // TODO this test
    });

    it('should emit a 100% upload percentage when the file has been uploaded', () => {
      // TODO this test
    });

    it('should fire "file-upload-error" with associated file and error', () => {
      // TODO this test
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
      const uploadService = new UploadService(
        apiUrl,
        authProvider,
        config.uploadParams || { collection: collectionNameStub },
        config.userAuthProvider,
      );

      (uploadService as any).api = {
        copyFileToCollection: config.copyFileToCollectionSpy,
      };

      const sourceFileId = 'some-source-file-id';
      const sourceFileCollection = collectionNameStub;

      return {
        uploadService,
        authProvider,
        sourceFileId,
        sourceFileCollection,
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
