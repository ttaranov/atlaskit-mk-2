import createNamespaceContext from './lib/createNamespaceContext';

export const NAVIGATION_CONTEXT = 'navigationCtx';

export const NavigationAnalyticsContext = createNamespaceContext(
  NAVIGATION_CONTEXT,
  'NavigationAnalyticsContext',
);
