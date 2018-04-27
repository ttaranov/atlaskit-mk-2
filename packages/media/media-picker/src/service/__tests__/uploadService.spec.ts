import { AuthProvider } from '@atlaskit/media-core';
import { UploadParams } from '../..';
import * as getPreviewModule from '../../util/getPreviewFromBlob';
import * as getPreviewFromVideo from '../../util/getPreviewFromVideo';
import { UploadService } from '../uploadService';
import { ContextFactory } from '../../../../media-core';

describe('UploadService', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';
  const collection = 'some-collection';
  const clientBasedAuthProvider = () => Promise.resolve({ clientId, token });
  // const issuerBasedAuthProvider = () => Promise.resolve({ asapIssuer, token });

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
  });

  describe('add', () => {
    const setup = () => {
      (getPreviewModule.getPreviewFromBlob as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());
      (getPreviewFromVideo.getPreviewFromVideo as any) = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const uploadService = new UploadService(getContext(), {
        collection: '',
      });

      const resumable = uploadService['resumable'];

      const filesAddedPromise = new Promise(resolve =>
        uploadService.on('files-added', () => resolve()),
      );

      return { uploadService, resumable, filesAddedPromise };
    };

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
