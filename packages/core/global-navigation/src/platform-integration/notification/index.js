// @flow
import React from 'react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';

import NotificationDrawerContents from './components/NotificationDrawerContents';

// TODO: this should be dynamic updated from outside
export const CONTENT_URL = '/examples/core/global-navigation/iframe';

const notificationIntegration = (
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
  refreshRate?: number,
  onCountUpdated: Function,
  onCountUpdating: Function,
) => ({
  badge: () => {
    console.log('Incoming refresh rate: ', refreshRate);

    return (
      <NotificationIndicator
        // notificationLogProvider={
        //   new NotificationLogClient(fabricNotificationLogUrl, cloudId)
        // }
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
