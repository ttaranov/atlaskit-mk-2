import { changeAccount, CHANGE_SERVICE } from '../actions';

export const changeService = (store: any) => (next: any) => (action: any) => {
  if (action.type === CHANGE_SERVICE) {
    const accounts = store.getState().accounts;
    if (accounts) {
      const firstAcc = accounts.filter(
        (account: any) => account.type === action.serviceName,
      )[0];
      const accountId = firstAcc ? firstAcc.id : undefined;

      store.dispatch(changeAccount(action.serviceName, accountId));
    }
  }

  return next(action);
};
