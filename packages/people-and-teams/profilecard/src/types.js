// @flow
export type PresenceTypes =
  | 'none'
  | 'available'
  | 'busy'
  | 'unavailable'
  | 'focus';

export type ProfileCardAction = {
  callback?: Function,
  shouldRender?: Function,
  id: string,
  label: string,
};

export type ProfilecardProps = {
  isActive?: boolean,
  isBot?: boolean,
  avatarUrl?: string,
  fullName?: string,
  meta?: string,
  nickname?: string,
  email?: string,
  location?: string,
  timestring?: string,
  presence?: PresenceTypes,
  actions?: ProfileCardAction[],
  isLoading?: boolean,
  hasError?: boolean,
  errorType?: ?ProfileCardErrorType,
  clientFetchProfile?: Function,
  analytics?: Function,
  presenceMessage?: string,
};

export type ProfileClient = {
  makeRequest: (cloudId: string, userId: string) => Promise<any>,
  setCachedProfile: (cloudId: string, userId: string, cacheItem: any) => void,
  getCachedProfile: (cloudId: string, userId: string) => any,
  flushCache: () => void,
  getProfile: (cloudId: string, userId: string) => Promise<any>,
};

export type ProfilecardTriggerPosition =
  | 'top left'
  | 'top right'
  | 'right top'
  | 'right bottom'
  | 'bottom right'
  | 'bottom left'
  | 'left bottom'
  | 'left top';

export type ProfileCardErrorType = {
  reason: 'default' | 'NotFound',
};

export type AkProfileClientConfig = {
  url: string,
  cacheSize?: number,
  cacheMaxAge?: number,
};
