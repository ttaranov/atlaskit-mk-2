import { UploadParams } from '@atlaskit/media-core';
import { ResumableFile, ResumableChunk } from 'resumablejs';
import * as Resumable from 'resumablejs';
import { Hasher } from '../../src/service/hashing/hasher';
import * as hasherCreatorModule from '../../src/service/hashing/hasherCreator';

// We need this mocking to happen before importing uploadService
const createHasher = hasherCreatorModule.createHasher;
const createHasherSpy = jest.spyOn(hasherCreatorModule, 'createHasher');
let hasherHashSpy: jest.SpyInstance<Hasher['hash']>;

createHasherSpy.mockImplementation(() => {
  const hasher = createHasher();
  hasherHashSpy = jest.spyOn(hasher, 'hash');
  return hasher;
});

import { UploadService } from '../../src/service/uploadService';
import { AuthProvider } from '@atlaskit/media-core';

describe('UploadService', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';
  const collection = 'some-collection';
  const clientBasedAuthProvider = () => Promise.resolve({ clientId, token });
  const issuerBasedAuthProvider = () => Promise.resolve({ asapIssuer, token });

  beforeEach(() => {
    hasherHashSpy.mockReset();
  });

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: new UploadService(apiUrl, clientBasedAuthProvider, {
        collection: '',
      }),
    });

    it('should apply defaultUploadParams', () => {
      const { uploadService } = setup();

      uploadService.setUploadParams({ collection: '' });

      expect(uploadService.getUploadParams()).toEqual({
        collection: '',
        fetchMetadata: true,
        autoFinalize: true,
      });
    });

    it('should combine default uploadParams given new upload parameters', () => {
      const { uploadService } = setup();
      const newUploadParams = {
        collection,
        autoFinalize: false,
      };

      uploadService.setUploadParams(newUploadParams);

      expect(uploadService.getUploadParams()).toEqual({
        collection,
        fetchMetadata: true,
        autoFinalize: false,
      });
    });
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

  describe('cancel', () => {
    const setup = () => {
      const uploadService = new UploadService(apiUrl, clientBasedAuthProvider, {
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

  const setupForSpy = (authProvider: AuthProvider): Promise<Resumable> => {
    const uploadService = new UploadService(apiUrl, authProvider, {
      collection: '',
    });
    const resumable: Resumable = uploadService['resumable'];

    const file = new File([new Blob()], 'filename');
    uploadService.addFile(file);
    resumable.upload();
    return new Promise(resolve => {
      resumable.on('uploadStart', () => resolve(resumable));
    });
  };

  describe('query', () => {
    it('should have client based auth parameters', () =>
      setupForSpy(clientBasedAuthProvider).then((resumable: Resumable) => {
        const queryResult = (resumable.opts.query as any)(
          resumable.files[0],
          resumable.files[0].chunks[0],
        );
        expect(queryResult).toEqual(
          expect.objectContaining({
            client: clientId,
            token,
          }),
        );
      }));

    it('should have issuer based auth parameters', () =>
      setupForSpy(issuerBasedAuthProvider).then((resumable: Resumable) => {
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
      setupForSpy(clientBasedAuthProvider).then((resumable: Resumable) => {
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
      setupForSpy(issuerBasedAuthProvider).then((resumable: Resumable) => {
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
      const uploadService = new UploadService(apiUrl, clientBasedAuthProvider, {
        collection: '',
      });
      const resumable = uploadService['resumable'];
      return { uploadService, resumable };
    };

    it('should call createHasher once and its hash function twice for different UploadService instance', () => {
      const { uploadService: uploadService1, resumable: resumable1 } = setup();
      const { uploadService: uploadService2, resumable: resumable2 } = setup();

      const file = new File([new Blob()], 'filename');

      const promise1 = new Promise(resolve =>
        resumable1.on('filesAdded', () => resolve()),
      );
      const promise2 = new Promise(resolve =>
        resumable2.on('filesAdded', () => resolve()),
      );

      uploadService1.addFile(file);
      uploadService2.addFile(file);

      return Promise.all([promise1, promise2]).then(() => {
        expect(hasherHashSpy).toHaveBeenCalledTimes(2);
        expect(createHasherSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('File events', () => {
    const setup = (
      config: { uploadParams?: UploadParams; progress?: number } = {},
    ) => {
      const uploadService = new UploadService(
        apiUrl,
        clientBasedAuthProvider,
        config.uploadParams || { collection: '' },
      );
      const resumable = uploadService['resumable'];
      const emitter = uploadService['emitter'];
      const resumableFile = {
        uniqueIdentifier: 'some-unique-identifier',
        file: {
          name: 'some-file-name',
          type: 'jpg',
        },
        chunks: [] as ResumableChunk[],
        progress: jest.fn().mockReturnValue(config.progress),
      };

      jest.spyOn(uploadService as any, 'finalizeFile');
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

    it('should finalize file automatically if finalizeFile in uploadParams is true', () => {
      const { uploadService, resumable, resumableFile, emitter } = setup({
        uploadParams: { collection, autoFinalize: true },
      });

      resumable.fire('fileSuccess', resumableFile as any, '');

      expect(emitter.emit).not.toHaveBeenCalled();
      expect(uploadService['finalizeFile']).toHaveBeenCalledTimes(1);
      expect(uploadService['finalizeFile']).toHaveBeenCalledWith(resumableFile);
    });

    it('should emit "file-finalize-ready" if finalizeFile in uploadParams is false', () => {
      const { uploadService, resumable, resumableFile, emitter } = setup({
        uploadParams: { collection, autoFinalize: false },
      });

      resumable.fire('fileSuccess', resumableFile as any, '');

      expect(emitter.emit).toHaveBeenCalledTimes(1);
      expect(emitter.emit).toHaveBeenCalledWith(
        'file-finalize-ready',
        expect.objectContaining({
          file: expect.objectContaining({
            name: resumableFile.file.name,
          }),
        }),
      );
      expect(uploadService['finalizeFile']).not.toHaveBeenCalled();

      const { finalize } = (emitter.emit as jest.Mock<void>).mock.calls[0][1];

      finalize();

      expect(uploadService['finalizeFile']).toHaveBeenCalledTimes(1);
      expect(uploadService['finalizeFile']).toHaveBeenCalledWith(resumableFile);
    });

    it('should fire "file-upload-error" with associated file and error', () => {
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
    });
  });
});
