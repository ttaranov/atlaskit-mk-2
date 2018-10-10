// @flow
import React from 'react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';

import NotificationDrawerContents from './components/NotificationDrawerContents';

// TODO: this should be dynamic updated from outside
export const CONTENT_URL = '/home/notificationsDrawer/iframe.html';

const notificationIntegration = (
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
  refreshRate?: number,
  onCountUpdated: Function,
  onCountUpdating: Function,
  externalContentUrl?: string,
) => ({
  badge: () => {
    console.log('Incoming refresh rate: ', refreshRate);

    return (
      <NotificationIndicator
        fabricNotificationLogUrl={fabricNotificationLogUrl}
        cloudId={cloudId}
        refreshRate={refreshRate}
        onCountUpdated={onCountUpdated}
        onCountUpdating={onCountUpdating}
      />
    );
  },
  notificationDrawerContents: () => (
    <NotificationDrawerContents
      externalContentUrl={externalContentUrl || CONTENT_URL}
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
