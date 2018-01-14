import { Action } from 'redux';

import { isChangeAccountAction } from '../actions';
import { State } from '../domain';

export default function accountChange(state: State, action: Action): State {
  if (isChangeAccountAction(action)) {
    const { accountId, serviceName } = action;
    return {
      ...state,
      view: {
        ...state.view,
        hasError: false,
        service: {
          accountId,
          name: serviceName,
        },
        path: [],
        items: [],
      },
    };
  } else {
    return state;
  }
}
