import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { NotificationLogProvider, NotificationCountResponse } from './types';

export default class NotificationLogClient implements NotificationLogProvider {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(baseUrl: string, cloudId: string) {
    this.serviceConfig = { url: baseUrl };
    this.cloudId = cloudId;
  }

  public async countUnseenNotifications(): Promise<NotificationCountResponse> {
    const options: RequestServiceOptions = {
      path: 'api/notifications/countUnseenNotifications',
      queryParams: {
        cloudId: this.cloudId,
        direct: true,
      },
      requestInit: {
        mode: 'cors' as 'cors',
      },
    };

    return utils.requestService(this.serviceConfig, options) as Promise<
      NotificationCountResponse
    >;
  }
}
