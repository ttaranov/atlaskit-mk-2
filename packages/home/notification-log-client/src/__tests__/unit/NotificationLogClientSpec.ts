import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import { version as npmPackageVersion } from '../../../package.json';
import {
  NotificationLogClient,
  NotificationCountResponse,
  DEFAULT_SOURCE,
} from '../..';

const notificationLogUrl = 'http://notification-log';

describe('NotificationLogClient', () => {
  const response: NotificationCountResponse = {
    count: 5,
  };

  beforeEach(() => {
    fetchMock.mock({
      matcher: `begin:${notificationLogUrl}/api/2/notifications/count/unseen`,
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

  it('should add the app version header', () => {
    const provider = new NotificationLogClient(notificationLogUrl, '123');
    return provider.countUnseenNotifications().then(() => {
      expect(fetchMock.lastOptions().headers.get('x-app-version')).toEqual(
        `${npmPackageVersion}-${DEFAULT_SOURCE}`,
      );
    });
  });
});
