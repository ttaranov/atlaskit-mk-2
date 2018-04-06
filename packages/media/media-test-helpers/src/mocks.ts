/* tslint:disable:no-console */

import mock, { MockRequest, MockResponse, proxy } from 'xhr-mock';
import {
  MockContext,
  copyWithToken,
  getFile,
  getFileImage,
  tenantAuth,
  userAuth,
  userCollectionFetch,
} from './mockData';

export const mediaMock = {
  enable: (
    hosts: Array<string> = [
      'dt-api.dev.atl-paas.net',
      'media-playground.dev.atl-paas.net',
      'api-private.dev.atlassian.com',
    ],
  ) => {
    const lazyContext: MockContext = new MockContext();
    const context = (): MockContext => lazyContext;

    mock.setup();

    mock.use(copyWithToken(context));
    mock.use(getFile(context));
    mock.use(getFileImage(context));
    mock.use(tenantAuth(context));
    mock.use(userAuth(context));
    mock.use(userCollectionFetch(context));
    mock.use((req: MockRequest, res: MockResponse) => {
      if (req.url().host && hosts.indexOf(req.url().host || '') === -1) {
        return proxy(req, res);
      } else {
        return undefined;
      }
    });

    mock.error((ev: { req: MockRequest; err: Error }) => {
      console.error('xhr-mock', ev.req, ev.err);
    });
  },

  disable: () => {
    mock.teardown();
  },
};
