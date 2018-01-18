// We still need postis here to communicate with the "link-account-handler" iframe
import * as postis from 'postis';
import * as url from 'url';
import * as uuid from 'uuid';
import { AuthProvider } from '@atlaskit/media-core';

import { ServiceName } from '../domain';
import { mapAuthToQueryParameters } from '../domain/auth';
import { objectToQueryString } from '../tools/objectToQueryString';

export class CloudService {
  constructor(private readonly userAuthProvider: AuthProvider) {}

  startAuth(
    apiUrl: string,
    redirectUrl: string,
    serviceName: ServiceName,
  ): Promise<void> {
    const win = window.open('', '_blank');

    return this.userAuthProvider()
      .then(auth => {
        return new Promise<void>((resolve, reject) => {
          const channelId = uuid.v4();

          const authParams = mapAuthToQueryParameters(auth);
          const queryString = objectToQueryString({
            ...authParams,
            redirectUrl: `${redirectUrl}?channelId=${channelId}`,
          } as any);

          const url = `${this.pickerUrl(
            apiUrl,
          )}/service/${serviceName}?${queryString}`;

          // Electron does not support location.assign so we must use the
          // string setter to assign a new location to the window
          (win as any).location = url;

          const channel = (postis as Function)({
            window: win,
            scope: channelId,
          });
          channel.ready(() => {
            channel.listen('auth-callback-received', () => {
              // notify auth window to close itself
              channel.send({ method: 'auth-callback-done', params: {} });

              // unregister the channel listener
              channel.destroy();

              resolve();

              // TODO: MSW-69 what happens if this times out?
            });
          });
        });
      })
      .catch(e => {
        win.close();
        throw e;
      });
  }

  private fileStoreUrl(apiUrl: string): string {
    const { protocol, host } = url.parse(apiUrl);
    return `${protocol}//${host}`;
  }

  private pickerUrl(apiUrl: string): string {
    return `${this.fileStoreUrl(apiUrl)}/picker`;
  }
}
