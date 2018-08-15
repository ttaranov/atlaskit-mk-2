import { changeService as changeServiceActionCreator } from '../../../actions';
import { changeService } from '../../changeService';
import { mockStore } from '../../../mocks';

describe('changeService()', () => {
  it('should NOT dispatch CHANGE_ACCOUNT given unknown action', () => {
    const store = mockStore();
    const next = jest.fn();

    const unknownAction = { type: 'UNKNOWN_ACTION' };
    changeService(store)(next)(unknownAction);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(unknownAction);
  });

  it('should dispatch CHANGE_ACCOUNT given CHANGE_ACCOUNT action', () => {
    const store = mockStore();
    const next = jest.fn();

    const serviceName = 'google';
    const changeServiceAction = changeServiceActionCreator(serviceName);
    changeService(store)(next)(changeServiceAction);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(changeServiceAction);
  });

  it('should dispatch CHANGE_ACCOUNT action with first account id if accounts for the given service are in state', () => {
    const next = jest.fn();
    const stubAccounts: Array<any> = [
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ];
    const store = mockStore({ accounts: stubAccounts });

    const serviceName = 'dropbox';
    const unknownAction = changeServiceActionCreator(serviceName);
    changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(1);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName,
      accountId: '2',
    });
  });

  it('should dispatch CHANGE_ACCOUNT action with accountId as empty string if there are NO accounts for the given service are in state', () => {
    const next = jest.fn();
    const stubAccounts: Array<any> = [
      { type: 'google', id: '1' },
      { type: 'dropbox', id: '2' },
      { type: 'google', id: '3' },
      { type: 'dropbox', id: '4' },
    ];
    const store = mockStore({ accounts: stubAccounts });

    const serviceName = 'upload';
    const unknownAction = changeServiceActionCreator(serviceName);
    changeService(store)(next)(unknownAction);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ACCOUNT',
      serviceName: 'upload',
      accountId: '',
    });
  });
});
