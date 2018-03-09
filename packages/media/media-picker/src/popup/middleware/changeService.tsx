import { Store, Dispatch, Action } from 'redux';

import { State } from '../domain';
import { changeAccount, isChangeServiceAction } from '../actions';

export const changeService = (store: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  if (isChangeServiceAction(action)) {
    const { serviceName } = action;
    const accounts = store.getState().accounts;

    const firstAccount = accounts.filter(
      account => account.type === action.serviceName,
    )[0];
    const accountId = firstAccount ? firstAccount.id : '';

    store.dispatch(changeAccount(serviceName, accountId));
  }

  return next(action);
};
