import { changeAccount } from '../../actions/changeAccount';
import { changeCloudAccountFolder } from '../../actions/changeCloudAccountFolder';
import changeAccountMiddleware from '../changeAccount';

describe('changeAccount', () => {
  const serviceName = 'google';
  const accountId = 'some-account-id';
  const setup = () => {
    return {
      api: {
        dispatch: jest.fn(),
        getState: jest.fn(),
      },
      next: jest.fn(),
    };
  };

  it('should dispatch changeCloudAccountFolder action given changeAccount action', () => {
    const { api, next } = setup();

    changeAccountMiddleware(api)(next)(changeAccount(serviceName, accountId));

    expect(api.dispatch).toBeCalledWith(
      changeCloudAccountFolder(serviceName, accountId, []),
    );
  });

  it('should not dispatch given not a changeAccount action', () => {
    const { api, next } = setup();

    changeAccountMiddleware(api)(next)(
      changeCloudAccountFolder(serviceName, accountId, []),
    );

    expect(api.dispatch).not.toBeCalled();
  });
});
