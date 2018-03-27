import { constructAuthTokenUrl } from '../../src/newgen/util';
import { Stubs } from '../_stubs';
import { AuthProvider } from '@atlaskit/media-core';

const token = 'some-token';
const serviceHost = 'some-service-host';

function createContext(authProvider: AuthProvider) {
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(contextConfig, undefined) as any;
}

describe('constructAuthTokenUrl', () => {
  it('should add auth token and client query parameters to the url when auth is client based', async () => {
    const clientId = 'some-client-id';
    const clientAuthProvider = jest.fn(() =>
      Promise.resolve({ token, clientId }),
    );
    const context = createContext(clientAuthProvider);
    const url = await constructAuthTokenUrl(
      '/file/3333-4444-5555',
      context,
      'mycollection',
    );
    expect(url).toEqual(
      'some-service-host/file/3333-4444-5555?client=some-client-id&collection=mycollection&token=some-token',
    );
  });

  it('should add the auth token to the url when auth type is ASAP', async () => {
    const issuer = 'some-issuer'; // issuer gets send through the headers, so it shouldn't show up in the url
    const asapAuthProvider = jest.fn(() => Promise.resolve({ token, issuer }));
    const context = createContext(asapAuthProvider);
    const url = await constructAuthTokenUrl(
      '/file/3333-4444-5555',
      context,
      'mycollection',
    );
    expect(url).toEqual(
      'some-service-host/file/3333-4444-5555?collection=mycollection&token=some-token',
    );
  });
});
