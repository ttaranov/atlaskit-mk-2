import * as React from 'react';

import { NotificationIndicator } from '../src';
import MockNotificationLogClient from './MockNotificationLogClient';

export default function Example() {
  const client = new MockNotificationLogClient();
  client.setResponse(Promise.resolve({ count: 5 }));

  return (
    <NotificationIndicator notificationLogProvider={Promise.resolve(client)} />
  );
}
