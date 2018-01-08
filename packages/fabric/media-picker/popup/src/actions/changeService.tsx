import { ServiceName } from '../domain';

export const CHANGE_SERVICE = 'SERVICE_CHANGE';

export interface ChangeServiceAction {
  readonly type: 'SERVICE_CHANGE';
  readonly serviceName: ServiceName;
}

export function changeService(serviceName: ServiceName): ChangeServiceAction {
  return {
    type: CHANGE_SERVICE,
    serviceName,
  };
}
