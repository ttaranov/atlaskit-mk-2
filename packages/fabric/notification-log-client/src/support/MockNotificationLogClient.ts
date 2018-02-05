import NotificationLogClient from '../NotificationLogClient';
import { NotificationCountResponse } from '../types';

export default class MockNotificationLogClient extends NotificationLogClient {
  private response?: Promise<NotificationCountResponse>;

  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return (
      this.response ||
      Promise.resolve({
        count: 5,
      })
    );
  }

  public setResponse(response: Promise<NotificationCountResponse>) {
    this.response = response;
  }
}
