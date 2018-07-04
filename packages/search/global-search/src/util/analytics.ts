import { GasPayload } from '@atlaskit/analytics-gas-types';

export const DEFAULT_GAS_SOURCE = 'globalSearchDrawer';
export const DEFUALT_GAS_CHANNEL = 'fabric-elements';
export const DEFAULT_GAS_ATTRIBUTES = {
  packageName: 'global-search',
  packageVersion: '0.0.0',
  componentName: 'GlobalQuickSearch',
};

export const sanitizeSearchQuery = query => {
  return (query || '').replace(/\s+/g, ' ').trim();
};

export enum Screen {
  PRE_QUERY = 'globalSearchPreQueryDrawer',
  POST_QUERY = 'globalSearchPostQueryDrawer',
}

export function buildScreenEvent(
  screen: Screen,
  timesViewed: number,
  searchSessionId: string,
): GasPayload {
  return {
    action: 'viewed',
    actionSubject: screen,
    eventType: 'screen',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      timesViewed: timesViewed,
      searchSessionId: searchSessionId,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
}
