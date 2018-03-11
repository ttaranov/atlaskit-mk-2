import { ServiceName } from '../domain';

export const START_AUTH = 'AUTH_START';

export interface StartAuthAction {
  readonly type: 'AUTH_START';
  readonly serviceName: ServiceName;
}

export function startAuth(serviceName: ServiceName): StartAuthAction {
  return {
    type: START_AUTH,
    serviceName,
  };
}
