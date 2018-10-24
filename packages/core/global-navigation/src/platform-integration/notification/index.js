// @flow
import React from 'react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';

import NotificationDrawerContents from './components/NotificationDrawerContents';

export const CONTENT_URL = '/home/notificationsDrawer/iframe.html';

const notificationIntegration = (
  fabricNotificationLogUrl?: string,
  cloudId?: string,
  locale?: string,
  product?: string,
  refreshRate?: number,
  onCountUpdated: () => void,
  onCountUpdating: () => void,
) =>
  fabricNotificationLogUrl && cloudId
    ? {
        badge: () => (
          <NotificationIndicator
            notificationLogProvider={
              new NotificationLogClient(fabricNotificationLogUrl, cloudId)
            }
            refreshRate={refreshRate}
            onCountUpdated={onCountUpdated}
            onCountUpdating={onCountUpdating}
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
      }
    : {
        badge: null,
        notificationDrawerContents: null,
        onNotificationDrawerOpen: Function.prototype,
        onNotificationDrawerClose: Function.prototype,
      };

export default notificationIntegration;
