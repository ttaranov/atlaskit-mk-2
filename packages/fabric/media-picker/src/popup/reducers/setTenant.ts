import { SetTenantAction, SET_TENANT } from '../actions/setTenant';
import { State } from '../domain';

export default function setTenant(
  state: State,
  action: SetTenantAction,
): State {
  if (action.type === SET_TENANT) {
    return { ...state, tenant: action.tenant };
  } else {
    return state;
  }
}
