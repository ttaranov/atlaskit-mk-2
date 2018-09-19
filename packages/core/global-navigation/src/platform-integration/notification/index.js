// @flow
import React from 'react';

import NotificationBadge from './components/NotificationBadge';
import NotificationDrawerContents from './components/NotificationDrawerContents';

export const CONTENT_URL = '/home/notificationsDrawer/iframe.html';

const notificationIntegration = (
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
) => ({
  badge: () => (
    <NotificationBadge
      fabricNotificationLogUrl={fabricNotificationLogUrl}
      cloudId={cloudId}
    />
  ),
  notificationDrawerContents: () => (
    <NotificationDrawerContents
      externalContentUrl={CONTENT_URL}
      locale={locale}
      product={product}
    />
  ),
  onNotificationDrawerOpen: () => {
    console.log('clear notification badge count here');
  },
  onNotificationDrawerClose: () => {
    console.log('optional call back to do stuff when the iframe closes');
  },
});

export default notificationIntegration;
