import { UploadProcessingEvent } from '../../../src/domain/uploadEvent';
import { mockStore, mockParentChannel } from '../mocks';
import { proxyUploadEvents } from '../../../src/popup/middleware/proxyUploadEvents';
import { FINALIZE_UPLOAD } from '../../../src/popup/actions/finalizeUpload';
import { RECENTS_COLLECTION } from '../../../src/popup/config';

describe('proxyUploadEvents middleware', () => {
  const client: any = { id: 'some-client-id' };
  const firstUploadId = 'first-upload-id';
  const secondUploadId = 'second-upload-id';
  const tenant: any = { id: 'some-tenant' };
  const uploads: any = {
    'first-id': {},
    'second-id': { proxy: 'wrong-proxy ' },
    'third-id': { proxy: [firstUploadId, secondUploadId], tenant },
  };
  const state = { uploads, client };
  const publicId = 'some-public-id';
  const file = {
    id: 'third-id',
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
  };

  const setup = () => {
    const store = mockStore(state);
    const next = jest.fn();
    const parentChannel = mockParentChannel();

    return { store, next, parentChannel };
  };

  it('should do nothing and call next with action for the action of the other type', () => {
    const { store, next, parentChannel } = setup();
    const action: any = {
      type: 'SOME_OTHER_TYPE',
    };

    proxyUploadEvents(parentChannel)(store)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledTimes(0);
    expect(parentChannel.sendUploadEvent).toHaveBeenCalledTimes(0);
  });

  it('should dispatch FINALIZE_UPLOAD for upload-processing event', () => {
    const { store, next, parentChannel } = setup();
    const originalEvent: UploadProcessingEvent = {
      name: 'upload-processing',
      data: {
        file: {
          ...file,
          publicId,
        },
      },
    };
    const action = {
      type: 'FILE_UPLOAD_PROCESSING_START',
      file,
      originalEvent,
    };
    const source = { id: publicId, collection: RECENTS_COLLECTION };

    proxyUploadEvents(parentChannel)(store)(next)(action);

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(parentChannel.sendUploadEvent).toHaveBeenCalledTimes(0);

    const calls = store.dispatch.mock.calls;
    expect(calls[0][0]).toEqual({
      type: FINALIZE_UPLOAD,
      uploadId: firstUploadId,
      file: originalEvent.data.file,
      source,
      tenant,
    });
    expect(calls[1][0]).toEqual({
      type: FINALIZE_UPLOAD,
      uploadId: secondUploadId,
      file: originalEvent.data.file,
      source,
      tenant,
    });
  });
});
