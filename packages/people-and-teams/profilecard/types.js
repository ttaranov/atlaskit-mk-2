// @flow
export type PresenceTypes = '' | 'Available' | 'Busy' | 'Away' | 'Focused';

export type ProfileCardAction = {
  callback: Function,
  shouldRender: Function,
  id: string,
  label: string,
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
