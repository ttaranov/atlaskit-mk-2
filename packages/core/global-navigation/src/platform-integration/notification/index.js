// @flow
import React from 'react';

import NotificationBadge from './components/NotificationBadge';
import NotificationDrawerContents from './components/NotificationDrawerContents';

import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';

export const CONTENT_URL = '/home/notificationsDrawer/iframe.html';

const notificationIntegration = (
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
) => ({
  badge: () => (
    <NotificationIndicator
      notificationLogProvider={
        new NotificationLogClient(fabricNotificationLogUrl, cloudId)
      }
      refreshRate={30000}
      onCountUpdated={() => {}}
      appearance="removed"
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
    // clear notification badge count here
  },
  onNotificationDrawerClose: () => {
    // optional call back to do stuff when the iframe closes
  },
});

export default notificationIntegration;
