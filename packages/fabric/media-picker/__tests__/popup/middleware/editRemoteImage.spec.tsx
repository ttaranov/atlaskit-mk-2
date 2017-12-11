import { couldNotLoadImage } from '../../../src/popup/components/views/editor/phrases';
import { mockAuthService, mockFetcher, mockStore } from '../mocks';

import { editRemoteImage } from '../../../src/popup/middleware/editRemoteImage';
import { editorShowImage } from '../../../src/popup/actions/editorShowImage';
import { editorShowLoading } from '../../../src/popup/actions/editorShowLoading';
import { editorShowError } from '../../../src/popup/actions/editorShowError';
import {
  EDIT_REMOTE_IMAGE,
  EditRemoteImageAction,
} from '../../../src/popup/actions/editRemoteImage';

describe('editRemoteImage', () => {
  const fileId = 'some-file-id';
  const file = {
    id: fileId,
    name: 'some-file-name',
  };
  const collectionName = 'some-collection';
  const auth = { clientId: 'some-client-id', token: 'some-token' };

  const setup = () => {
    const authService = mockAuthService();
    const fetcher = mockFetcher();
    const store = mockStore({
      editorData: {
        originalFile: file,
      },
    });

    authService.getUserAuth.mockReturnValue(Promise.resolve(auth));

    return { authService, fetcher, store };
  };

  it('should handle fetching failure', async () => {
    const { authService, fetcher, store } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };
    const { apiUrl } = store.getState();

    fetcher.getImage.mockReturnValueOnce(Promise.reject('some-error'));

    await editRemoteImage(fetcher, authService, store, action);

    expect(fetcher.getImage).toBeCalledWith(
      apiUrl,
      auth,
      fileId,
      collectionName,
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      editorShowError(couldNotLoadImage, expect.any(Function)),
    ]);
  });

  it('should handle fetching success', async () => {
    const { authService, fetcher, store } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };
    const { apiUrl } = store.getState();

    fetcher.getImage.mockReturnValueOnce(Promise.resolve(new Blob()));

    await editRemoteImage(fetcher, authService, store, action);

    expect(fetcher.getImage).toBeCalledWith(
      apiUrl,
      auth,
      fileId,
      collectionName,
    );
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      editorShowImage('data:;base64,'),
    ]);
  });
});
