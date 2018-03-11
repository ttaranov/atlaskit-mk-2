import { Action } from 'redux';
import { Tenant } from '../domain';

export const SET_TENANT = 'SET_TENANT';

export interface SetTenantAction extends Action {
  type: 'SET_TENANT';
  tenant: Tenant;
}

export function setTenant(tenant: Tenant): SetTenantAction {
  return {
    type: SET_TENANT,
    tenant,
  };
}
