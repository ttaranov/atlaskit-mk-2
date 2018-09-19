// @flow

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NAVIGATION_CHANNEL } from '../../constants';
import type { DrawerName } from './types';

export const fireDrawerDismissedEvents = (
  drawerName: DrawerName,
  analyticsEvent: UIAnalyticsEvent,
  analyticsNameMap: { [drawerName: DrawerName]: string },
): void => {
  if (
    analyticsEvent.payload.attributes &&
    analyticsEvent.payload.attributes.trigger === 'escKey'
  ) {
    const keyboardShortcutEvent = analyticsEvent.clone().update(() => ({
      action: 'pressed',
      actionSubject: 'keyboardShortcut',
      actionSubjectId: 'dismissDrawer',
      attributes: {
        key: 'Esc',
      },
    }));
    keyboardShortcutEvent.fire(NAVIGATION_CHANNEL);
  }
  analyticsEvent
    .update({
      actionSubjectId: analyticsNameMap[drawerName],
    })
    .fire(NAVIGATION_CHANNEL);
};
