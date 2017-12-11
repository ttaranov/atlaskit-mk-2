import { Action, Store, Dispatch } from 'redux';

import { AuthService } from '../services/auth-service';
import { updateServiceList } from '../actions';
import { Fetcher } from '../tools/fetcher/fetcher';
import { State } from '../domain';
import {
  GET_CONNECTED_REMOTE_ACCOUNTS,
  GetConnectedRemoteAccountsAction,
} from '../actions/getConnectedRemoteAccounts';

const isGetConnectedRemoteAccountsAction = (
  action: Action,
): action is GetConnectedRemoteAccountsAction => {
  return action.type === GET_CONNECTED_REMOTE_ACCOUNTS;
};

export const getConnectedRemoteAccounts = (
  fetcher: Fetcher,
  authService: AuthService,
) => (store: Store<State>) => (next: Dispatch<Action>) => (action: Action) => {
  if (isGetConnectedRemoteAccountsAction(action)) {
    const { apiUrl } = store.getState();

    authService
      .getUserAuth()
      .then(auth => fetcher.getServiceList(apiUrl, auth))
      .then(accounts => store.dispatch(updateServiceList(accounts)));
  }

  return next(action);
};
