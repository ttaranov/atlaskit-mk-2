import { couldNotLoadImage } from '../../../components/views/editor/phrases';
import { mockFetcher, mockStore } from '../../../mocks';

import { editRemoteImage } from '../../editRemoteImage';
import { editorShowImage } from '../../../actions/editorShowImage';
import { editorShowLoading } from '../../../actions/editorShowLoading';
import { editorShowError } from '../../../actions/editorShowError';
import {
  EDIT_REMOTE_IMAGE,
  EditRemoteImageAction,
} from '../../../actions/editRemoteImage';

describe('editRemoteImage', () => {
  const fileId = 'some-file-id';
  const file = {
    id: fileId,
    name: 'some-file-name',
  };
  const collectionName = 'some-collection';
  const auth = { clientId: 'some-client-id', token: 'some-token' };

  const setup = () => {
    const fetcher = mockFetcher();
    const store = mockStore({
      editorData: {
        originalFile: file,
      },
    });
    const { userContext } = store.getState();
    (userContext.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    return { fetcher, store };
  };

  it('should handle fetching failure', async () => {
    const { fetcher, store } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };
    fetcher.getImage.mockReturnValueOnce(Promise.reject('some-error'));

    await editRemoteImage(fetcher, store, action);

    expect(fetcher.getImage).toBeCalledWith(auth, fileId, collectionName);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      editorShowError(couldNotLoadImage, expect.any(Function)),
    ]);
  });

  it('should handle fetching success', async () => {
    const { fetcher, store } = setup();
    const action: EditRemoteImageAction = {
      type: EDIT_REMOTE_IMAGE,
      item: file,
      collectionName,
    };
    fetcher.getImage.mockReturnValueOnce(Promise.resolve(new Blob()));

    await editRemoteImage(fetcher, store, action);

    expect(fetcher.getImage).toBeCalledWith(auth, fileId, collectionName);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch.mock.calls[0]).toEqual([editorShowLoading(file)]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      editorShowImage('data:;base64,'),
    ]);
  });
});
