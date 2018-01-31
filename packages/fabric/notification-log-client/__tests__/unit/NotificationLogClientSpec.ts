import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import NotificationLogClient from '../../src/api/NotificationLogClient';
import { NotificationCountResponse } from '../../src';

const notificationLogUrl = 'http://notification-log';

describe('NotificationLogClient', () => {
  const response: NotificationCountResponse = {
    count: 5,
  };

  beforeEach(() => {
    fetchMock.mock({
      matcher: `begin:${notificationLogUrl}/api/notifications/countUnseenNotifications`,
      response,
      name: 'notification-log',
    });
  });

  afterEach(fetchMock.restore);

  it('should resolve count unseen notifications', () => {
    const provider = new NotificationLogClient(notificationLogUrl, '123');
    return provider.countUnseenNotifications().then(({ count }) => {
      expect(count).toEqual(5);
    });
  });
});
