import * as React from 'react';

import { MockNotificationLogClient } from '@atlaskit/notification-log-client/dist/es5/support';

import { NotificationIndicator } from '../src';

export default function Example() {
  const client = new MockNotificationLogClient();
  client.setResponse(Promise.resolve({ count: 5 }));

  return (
    <NotificationIndicator notificationLogProvider={Promise.resolve(client)} />
  );
}
