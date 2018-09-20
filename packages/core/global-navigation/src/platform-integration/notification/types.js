// @flow

import type { Element } from 'react';

export type NotificationIntegration = {|
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
  badge: () => Element<*>,
  notificationDrawerContents: () => Element<*>,
  onNotificationDrawerOpen: () => void,
  onNotificationDrawerClose: () => void,
|};
