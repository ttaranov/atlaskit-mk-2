// @flow

import type { Element } from 'react';

export type NotificationIntegration = {|
  badge: () => Element<*>,
  notificationDrawerContents: () => Element<*>,
  onNotificationDrawerOpen: () => void,
  onNotificationDrawerClose: () => void,
|};
