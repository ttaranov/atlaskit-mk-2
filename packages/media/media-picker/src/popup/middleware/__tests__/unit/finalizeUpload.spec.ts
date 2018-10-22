jest.mock('@atlaskit/media-store');
import { MediaStore, MediaFile } from '@atlaskit/media-store';
import { ProcessedFileState } from '@atlaskit/media-core';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import finalizeUploadMiddleware, { finalizeUpload } from '../../finalizeUpload';
import { UploadParams } from '../../../../domain/config';
import {
  FinalizeUploadAction,
  FINALIZE_UPLOAD,
} from '../../../actions/finalizeUpload';
import { Tenant, State } from '../../../domain';

const upfrontId = Promise.resolve('1');
const file = {
  id: 'some-file-id',
  name: 'some-file-name',
  type: 'some-file-type',
  creationDate: Date.now(),
  size: 12345,
  upfrontId,
};
const copiedFile = {
  ...file,
  id: 'some-copied-file-id',
};
const mediaFile: MediaFile = {
  id: 'some-copied-file-id',
  mediaType: 'image',
  mimeType: 'some-mime-type',
  name: 'some-file-name',
  processingStatus: 'succeeded',
  size: 12345,
  artifacts: {},
};

(MediaStore as any).mockImplementation(() => ({
  copyFileWithToken: () => Promise.resolve({ data: copiedFile }),
  getFile: () => Promise.resolve({ data: mediaFile }),
}));

// Do not this import. We want to mock MediaStore before it was used to create contexts
import { mockStore } from '../../../mocks';

describe('finalizeUploadMiddleware', () => {
  const auth = {
    clientId: 'some-client-id',
    token: 'some-token',
  };

  const copiedState: ProcessedFileState = {
    id: 'some-copied-file-id',
    status: 'processed',
    name: file.name,
    size: file.size,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'some-mime-type',
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const source = {
    id: file.id,
    collection,
  };
  const tenant: Tenant = {
    auth: {
      clientId: 'some-tenant-client-id',
      token: 'some-tenant-token',
      baseUrl: 'some-base-url',
    },
    uploadParams: {},
  };
  const setup = (
    uploadParams: UploadParams = {},
    state: Partial<State> = {},
  ) => {
    const store = mockStore(state);
    const { userContext } = store.getState();
    (userContext.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    // Even thought this mocking already been done outside above
    // we need to do it again because some tests override it and we need to
    // clean it up before next test.
    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken: () => Promise.resolve({ data: copiedFile }),
      getFile: () => Promise.resolve({ data: mediaFile }),
    }));

    return {
      store,
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
    const { store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware()(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event with metadata', () => {
    const { store, action } = setup();

    return finalizeUpload(store, action).then(
      action => {
        expect(action).toEqual(
          sendUploadEvent({
            event: {
              name: 'upload-end',
              data: {
                file: {
                  ...file,
                  publicId: copiedFile.id,
                },
                state: copiedState,
              },
            },
            uploadId,
          }),
        );
      },
      error => {
        expect(error).not.toBeDefined();
      },
    );
  });

  it('should send upload processing event with metadata', () => {
    const { store, action } = setup();

    return finalizeUpload(store, action).then(() => {
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

  it('should send upload error event given some error happens', () => {
    const { store, action } = setup();
    const error = {
      message: 'some-error-message',
    };

    (MediaStore as any).mockImplementation(() => ({
      getFile: () => Promise.resolve({ data: mediaFile }),
      copyFileWithToken: () => Promise.reject(error),
    }));

    return finalizeUpload(store, action).then(
      result => {
        expect(result).not.toBeDefined();
      },
      () => {
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
      },
    );
  });

  it('Should resolve deferred id when the source id is on the store', () => {
    const resolver = jest.fn();
    const rejecter = jest.fn();
    const { store, action } = setup(undefined, {
      deferredIdUpfronts: {
        'some-file-id': {
          resolver,
          rejecter,
        },
      },
    });

    return finalizeUpload(store, action).then(() => {
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toBeCalledWith('some-copied-file-id');
    });
  });
});
