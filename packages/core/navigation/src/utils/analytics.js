// @flow

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export const navigationChannel = 'navigation';

export type CollapseExpandTrigger = 'chevron' | 'resizerClick' | 'resizerDrag';

export const navigationExpandedCollapsed = (
  createAnalyticsEvent: $PropertyType<
    WithAnalyticsEventsProps,
    'createAnalyticsEvent',
  >,
  {
    isCollapsed,
    trigger,
  }: { isCollapsed: boolean, trigger: CollapseExpandTrigger },
) =>
  createAnalyticsEvent({
    action: isCollapsed ? 'collapsed' : 'expanded',
    actionSubject: 'productNavigation',
    attributes: {
      trigger,
    },
  }).fire(navigationChannel);
