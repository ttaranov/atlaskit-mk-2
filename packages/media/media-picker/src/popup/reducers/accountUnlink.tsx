import { UNLINK_ACCOUNT, UnlinkCloudAccountAction } from '../actions';
import { State } from '../domain';

export default function(state: State, action: UnlinkCloudAccountAction): State {
  if (action.type === UNLINK_ACCOUNT) {
    const accounts = state.accounts
      .slice()
      .filter(account => account.id !== action.account.id);
    return { ...state, accounts };
  } else {
    return state;
  }
}
