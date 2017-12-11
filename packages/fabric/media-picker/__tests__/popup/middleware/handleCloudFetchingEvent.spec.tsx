import { handleCloudFetchingEvent } from '../../../src/popup/middleware/handleCloudFetchingEvent';
import { mockParentChannel, mockStore } from '../mocks';
import {
  HANDLE_CLOUD_FETCHING_EVENT,
  HandleCloudFetchingEventAction,
} from '../../../src/popup/actions/handleCloudFetchingEvent';
import { FINALIZE_UPLOAD } from '../../../src/popup/actions/finalizeUpload';
import { GET_PREVIEW } from '../../../src/popup/actions/getPreview';
import { RECENTS_COLLECTION } from '../../../src/popup/config';

describe('handleCloudFetchingEvent', () => {
  const uploadId = 'some-upload-id';
  const fileId = 'file-id';
  const bytes = 50;
  const fileSize = 1000;
  const apiUrl = 'some-api-url';
  const client = { id: 'some-client-id', token: 'some-client-token' };
  const tenant = { id: 'some-tenant-id', token: 'some-tenant-token' };
  const description = 'some-error-description';
  const file = {
    id: 'some-id',
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
  };

  const setup = () => {
    return {
      parentChannel: mockParentChannel(),
      store: mockStore(),
      next: jest.fn(),
    };
  };

  it('should report upload-status-update to the parent channel when receives RemoteUploadProgress event', () => {
    const { parentChannel, store, next } = setup();
    const action: HandleCloudFetchingEventAction<'RemoteUploadProgress'> = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      file,
      event: 'RemoteUploadProgress',
      payload: { uploadId, bytes, fileSize },
    };
    const portion = 0.05;

    handleCloudFetchingEvent(parentChannel)(store)(next)(action);
    expect(parentChannel.sendUploadEvent).toHaveBeenCalledTimes(1);
    expect(parentChannel.sendUploadEvent).toHaveBeenCalledWith(
      {
        name: 'upload-status-update',
        data: {
          file,
          progress: {
            absolute: file.size * portion,
            expectedFinishTime: expect.any(Number),
            max: file.size,
            overallTime: expect.any(Number),
            portion,
            timeLeft: expect.any(Number),
          },
        },
      },
      uploadId,
    );
  });

  it('should dispatch finalizeUpload and getPreview when receives RemoteUploadEnd event', () => {
    const { parentChannel, store, next } = setup();
    const action: HandleCloudFetchingEventAction<'RemoteUploadEnd'> = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      file,
      event: 'RemoteUploadEnd',
      payload: { fileId, uploadId },
    };
    const remoteUploads = {
      'some-upload-id': { tenant },
    };

    store.getState.mockReturnValue({ apiUrl, client, remoteUploads });

    handleCloudFetchingEvent(parentChannel)(store)(next)(action);

    const uploadedFile = {
      ...file,
      id: fileId,
    };

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0][0]).toEqual({
      type: FINALIZE_UPLOAD,
      uploadId,
      file: uploadedFile,
      source: {
        id: fileId,
        collection: RECENTS_COLLECTION,
      },
      tenant,
    });
    expect(store.dispatch.mock.calls[1][0]).toEqual({
      type: GET_PREVIEW,
      uploadId,
      file: uploadedFile,
      collection: RECENTS_COLLECTION,
    });
  });

  it('should report upload-error to the parent channel when receives RemoteUploadFail event', () => {
    const { parentChannel, store, next } = setup();
    const action = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      event: 'RemoteUploadFail',
      payload: { uploadId, description },
    };

    handleCloudFetchingEvent(parentChannel)(store)(next)(action);

    expect(parentChannel.sendUploadEvent).toHaveBeenCalledTimes(1);
    expect(parentChannel.sendUploadEvent).toHaveBeenCalledWith(
      {
        name: 'upload-error',
        data: {
          error: {
            fileId: uploadId,
            name: 'remote_upload_fail',
            description,
          },
        },
      },
      uploadId,
    );
  });

  it('should call next(action) if the action type matches', () => {
    const { parentChannel, store, next } = setup();
    const action = {
      type: HANDLE_CLOUD_FETCHING_EVENT,
      event: 'unknown',
    };

    handleCloudFetchingEvent(parentChannel)(store)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call next(action) if the action type does not match', () => {
    const { parentChannel, store, next } = setup();
    const action = {
      type: 'some-other-type',
    };

    handleCloudFetchingEvent(parentChannel)(store)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
});
