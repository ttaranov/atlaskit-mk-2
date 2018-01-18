import { Store, Dispatch } from 'redux';

import {
  REQUEST_UNLINK_CLOUD_ACCOUNT,
  RequestUnlinkCloudAccountAction,
  changeService,
  unlinkCloudAccount,
} from '../actions';
import { State } from '../domain';
import { Fetcher } from '../tools/fetcher/fetcher';
import { AuthService } from '../../domain/auth';

export default (fetcher: Fetcher, authService: AuthService) => (
  store: Store<State>,
) => (next: Dispatch<State>) => (action: RequestUnlinkCloudAccountAction) => {
  if (action.type === REQUEST_UNLINK_CLOUD_ACCOUNT) {
    const { apiUrl } = store.getState();

    authService
      .getUserAuth()
      .then(auth => fetcher.unlinkCloudAccount(apiUrl, auth, action.account.id))
      .then(() => {
        store.dispatch(unlinkCloudAccount(action.account));
        store.dispatch(changeService(action.account.name));
      });
  }

  return next(action);
};
