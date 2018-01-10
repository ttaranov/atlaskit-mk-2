import { mockStore, mockFetcher, mockAuthService } from '../../mocks';
import { sendUploadEvent } from '../../actions/sendUploadEvent';
import finalizeUploadMiddleware, { finalizeUpload } from '../finalizeUpload';
import {
  FinalizeUploadAction,
  FINALIZE_UPLOAD,
} from '../../actions/finalizeUpload';
import { UploadParams } from '../../domain';

describe('finalizeUploadMiddleware', () => {
  const auth = {
    clientId: 'some-client-id',
    token: 'some-token',
  };
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
  };
  const copiedFile = {
    ...file,
    id: 'some-copied-file-id',
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const source = {
    id: file.id,
    collection,
  };
  const tenant = {
    auth: {
      clientId: 'some-tenant-client-id',
      token: 'some-tenant-token',
    },
    uploadParams: {},
  };
  const setup = (uploadParams: UploadParams = {}) => {
    const authService = mockAuthService();
    authService.getUserAuth.mockImplementation(() => Promise.resolve(auth));

    const fetcher = mockFetcher();
    fetcher.copyFile.mockImplementation(() => Promise.resolve(copiedFile));
    fetcher.pollFile.mockImplementation(() => Promise.resolve(copiedFile));

    return {
      fetcher,
      store: mockStore(),
      authService,
      next: jest.fn(),
      action: {
        type: FINALIZE_UPLOAD,
        file,
        uploadId,
        source,
        tenant: {
          ...tenant,
          uploadParams,
        },
      } as FinalizeUploadAction,
    };
  };

  it('should do nothing given unknown action', () => {
    const { fetcher, authService, store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware(fetcher, authService)(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event without metadata given fetch metadata param false', () => {
    const { fetcher, authService, store, action } = setup({
      fetchMetadata: false,
    });

    return finalizeUpload(fetcher, authService, store, action).then(action => {
      expect(action).toEqual(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file: {
                ...file,
                publicId: copiedFile.id,
              },
              public: {
                id: copiedFile.id,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload end event with metadata given fetch metadata param true', () => {
    const { fetcher, authService, store, action } = setup({
      fetchMetadata: true,
    });

    return finalizeUpload(fetcher, authService, store, action).then(action => {
      expect(action).toEqual(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file: {
                ...file,
                publicId: copiedFile.id,
              },
              public: copiedFile,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload processing event with metadata given fetch metadata param true', () => {
    const { fetcher, authService, store, action } = setup({
      fetchMetadata: true,
    });

    return finalizeUpload(fetcher, authService, store, action).then(action => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file: {
                ...file,
                publicId: copiedFile.id,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload finalize ready event given auto finalize param false', () => {
    const { fetcher, authService, store, action } = setup({
      autoFinalize: false,
    });

    return finalizeUpload(fetcher, authService, store, action).then(action => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-finalize-ready',
            data: {
              file,
              finalize: expect.any(Function),
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload error event given some error happens', () => {
    const { fetcher, authService, store, action } = setup();
    const error = {
      message: 'some-error-message',
    };

    fetcher.copyFile.mockImplementation(() => Promise.reject(error));

    return finalizeUpload(fetcher, authService, store, action).then(action => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              file,
              error: {
                name: 'object_create_fail',
                description: error.message,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });
});
