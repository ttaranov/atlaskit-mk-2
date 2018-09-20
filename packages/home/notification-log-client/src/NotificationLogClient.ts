import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import {
  name as npmPackageName,
  version as npmPackageVersion,
} from '../package.json';
import { NotificationLogProvider, NotificationCountResponse } from './types';

export default class NotificationLogClient implements NotificationLogProvider {
  private serviceConfig: ServiceConfig;
  private cloudId: string;
  private source: string;

  constructor(
    baseUrl: string,
    cloudId: string,
    source: string = npmPackageName,
  ) {
    this.serviceConfig = { url: baseUrl };
    this.cloudId = cloudId;
    this.source = source;
  }

  public async countUnseenNotifications(
    options: RequestServiceOptions = {},
  ): Promise<NotificationCountResponse> {
    const mergedOptions: RequestServiceOptions = {
      path: 'api/2/notifications/count/unseen',
      ...options,
      queryParams: {
        cloudId: this.cloudId,
        source: this.source,
        ...(options.queryParams || {}),
      },
      requestInit: {
        mode: 'cors' as 'cors',
        headers: {
          'x-app-version': `${npmPackageName}#${npmPackageVersion}`,
        },
        ...(options.requestInit || {}),
      },
    };

    return utils.requestService(this.serviceConfig, mergedOptions) as Promise<
      NotificationCountResponse
    >;
  }
}
