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

  public async countUnseenNotifications(
    options: RequestServiceOptions = {},
  ): Promise<NotificationCountResponse> {
    const mergedOptions: RequestServiceOptions = {
      path: 'api/2/notifications/count/unseen',
      ...options,
      queryParams: {
        cloudId: this.cloudId,
        ...(options.queryParams || {}),
      },
      requestInit: {
        mode: 'cors' as 'cors',
        ...(options.requestInit || {}),
      },
    };

    return utils.requestService(this.serviceConfig, mergedOptions) as Promise<
      NotificationCountResponse
    >;
  }
}
