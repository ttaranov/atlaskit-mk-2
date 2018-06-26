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
