import { ServiceAccountWithType } from '../domain';

export const UPDATE_SERVICE_LIST = 'SERVICE_LIST_UPDATE';

export interface UpdateServiceListAction {
  readonly type: 'SERVICE_LIST_UPDATE';
  readonly accounts: ServiceAccountWithType[];
}

export function updateServiceList(
  accounts: ServiceAccountWithType[],
): UpdateServiceListAction {
  return {
    type: UPDATE_SERVICE_LIST,
    accounts,
  };
}
