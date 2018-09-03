import { mockStore, mockFetcher } from '../../../mocks';
import getPreviewMiddleware, { getPreview } from '../../getPreview';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import { GetPreviewAction } from '../../../actions/getPreview';

describe('getPreviewMiddleware', () => {
  const auth = {
    clientId: 'some-client-id',
    token: 'some-token',
  };
  const upfrontId = Promise.resolve('1');
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
    upfrontId,
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const preview = {
    src: 'some-preview-src',
  };
  const setup = () => {
    const store = mockStore();
    const { userAuthProvider } = store.getState();
    userAuthProvider.mockImplementation(() => Promise.resolve(auth));

    const fetcher = mockFetcher();
    fetcher.getPreview.mockImplementation(() => Promise.resolve(preview));

    return {
      fetcher,
      store,
      next: jest.fn(),
      action: {
        type: 'GET_PREVIEW',
        file,
        collection,
        uploadId,
      } as GetPreviewAction,
    };
  };

  it('should do nothing given unknown action', () => {
    const { fetcher, store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    getPreviewMiddleware(fetcher)(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should dispatch send upload event action with upload-preview-update event', () => {
    const { fetcher, store, action } = setup();
    return getPreview(fetcher, store, action).then(action => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-preview-update',
            data: {
              file,
              preview,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should get preview from fetcher', () => {
    const { fetcher, store, action } = setup();
    return getPreview(fetcher, store, action).then(() => {
      expect(fetcher.getPreview).toBeCalledWith(auth, file.id, collection);
    });
  });
});
