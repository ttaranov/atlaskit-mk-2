import { RequestUnlinkCloudAccountAction } from '../../../src/popup/actions/unlinkCloudAccount';
import { FileListUpdateAction } from '../../../src/popup/actions/fileListUpdate';
import { mockAuthService, mockFetcher, mockStore } from '../mocks';
import { changeCloudAccountFolderMiddleware } from '../../../src/popup/middleware/changeCloudAccountFolder';
import {
  changeCloudAccountFolder,
  FILE_LIST_UPDATE,
  REQUEST_UNLINK_CLOUD_ACCOUNT,
} from '../../../src/popup/actions';

describe('changePath', () => {
  const clientId = 'some-client-id';
  const token = 'some-token';
  const serviceName = 'google';
  const accountId = 'some-account-id';
  const folderId = 'some-folder-id';
  const auth = { clientId, token };

  const setup = () => {
    const authService = mockAuthService();
    const fetcher = mockFetcher();
    const store = mockStore();
    const next = jest.fn();

    authService.getUserAuth.mockReturnValue(Promise.resolve(auth));

    return { authService, fetcher, store, next };
  };

  it('should skip fetching for different action type', () => {
    const { authService, fetcher, store, next } = setup();
    const action = { type: 'SOME_ANOTHER_REQUEST' };

    changeCloudAccountFolderMiddleware(fetcher, authService)(store)(next)(
      action as any,
    );

    expect(next).toBeCalledWith(action);
    expect(fetcher.fetchCloudAccountFolder).not.toBeCalled();
  });

  it('should dispatch path change when fetching successful', () => {
    const { authService, fetcher, store, next } = setup();
    const action = changeCloudAccountFolder(serviceName, accountId, [
      { id: folderId, name: 'some-folder' },
    ]);
    const items = ['item1'];
    const data = { id: 'some-id', items };
    const { apiUrl } = store.getState();

    fetcher.fetchCloudAccountFolder.mockReturnValueOnce(Promise.resolve(data));

    return new Promise((resolve, reject) => {
      store.dispatch.mockImplementation(
        (fileListUpdateAction: FileListUpdateAction) => {
          try {
            expect(fileListUpdateAction.type).toEqual(FILE_LIST_UPDATE);
            expect(fileListUpdateAction.accountId).toEqual(accountId);
            expect(fileListUpdateAction.items).toEqual(items);

            expect(fetcher.fetchCloudAccountFolder).toBeCalledWith(
              apiUrl,
              auth,
              action.serviceName,
              action.accountId,
              action.path[0].id,
            );

            expect(next).toBeCalledWith(action);

            resolve();
          } catch (error) {
            reject(error);
          }
        },
      );

      changeCloudAccountFolderMiddleware(fetcher, authService)(store)(next)(
        action,
      );
    });
  });

  it('should dispatch account unlink if fetching ended with 401 error', () => {
    const { authService, fetcher, store, next } = setup();
    const { apiUrl } = store.getState();
    const action = changeCloudAccountFolder(serviceName, accountId, [
      { id: folderId, name: 'some-folder' },
    ]);

    fetcher.fetchCloudAccountFolder.mockReturnValueOnce(
      Promise.reject({
        response: { status: 401 },
      }),
    );

    return new Promise((resolve, reject) => {
      store.dispatch.mockImplementation(
        (fileListUpdateAction: RequestUnlinkCloudAccountAction) => {
          try {
            expect(fileListUpdateAction.type).toEqual(
              REQUEST_UNLINK_CLOUD_ACCOUNT,
            );
            expect(fileListUpdateAction.account.id).toEqual(accountId);
            expect(fileListUpdateAction.account.name).toEqual(
              action.serviceName,
            );

            expect(fetcher.fetchCloudAccountFolder).toBeCalledWith(
              apiUrl,
              auth,
              action.serviceName,
              action.accountId,
              action.path[0].id,
            );

            expect(next).toBeCalledWith(action);

            resolve();
          } catch (error) {
            reject(error);
          }
        },
      );

      changeCloudAccountFolderMiddleware(fetcher, authService)(store)(next)(
        action,
      );
    });
  });
});
