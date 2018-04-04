import { Store, Dispatch } from 'redux';

import { updateServiceList, START_AUTH, StartAuthAction } from '../actions';
import { changeAccount } from '../actions/changeAccount';
import { State } from '../domain';
import { Fetcher } from '../tools/fetcher/fetcher';
import { CloudService } from '../services/cloud-service';
import { Context } from '@atlaskit/media-core';

export const startCloudAccountOAuthFlow = (
  fetcher: Fetcher,
  context: Context,
  cloudService: CloudService,
) => (store: Store<State>) => (next: Dispatch<State>) => (
  action: StartAuthAction,
) => {
  if (action.type === START_AUTH) {
    const { apiUrl, redirectUrl } = store.getState();
    const { serviceName } = action;

    cloudService
      .startAuth(apiUrl, redirectUrl, serviceName)
      .then(() => context.config.userAuthProvider())
      .then(auth => fetcher.getServiceList(apiUrl, auth))
      .then(accounts => {
        store.dispatch(updateServiceList(accounts));

        const selectedAccount = (accounts as any).find(
          account => account.type === serviceName,
        );
        if (selectedAccount) {
          store.dispatch(changeAccount(serviceName, selectedAccount.id));
        }
      })
      .catch(error => {
        // https://jira.atlassian.com/browse/FIL-3247
        // add error handler
      });
  }

  return next(action);
};
