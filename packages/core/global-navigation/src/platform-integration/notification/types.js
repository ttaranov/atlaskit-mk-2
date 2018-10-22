// @flow

import type { Element } from 'react';

export type NotificationIntegration = {|
  badge: () => Element<*> | null,
  notificationDrawerContents: () => Element<*> | null,
  onNotificationDrawerOpen: () => void,
  onNotificationDrawerClose: () => void,
|};
