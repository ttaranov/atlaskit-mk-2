import { MiddlewareAPI, Dispatch, Action } from 'redux';

import { isChangeAccountAction } from '../actions/changeAccount';
import { changeCloudAccountFolder } from '../actions/changeCloudAccountFolder';
import { State } from '../domain';

export default (api: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
  action: Action,
) => {
  if (isChangeAccountAction(action)) {
    const { serviceName, accountId } = action;

    api.dispatch(changeCloudAccountFolder(serviceName, accountId, []));
  }

  return next(action);
};
