// TODO [MSW-387]: Add typings
// This method requires CORS to be disabled
import { ClientBasedAuth } from '@atlaskit/media-core';

let userAuthProviderPromiseCache: Promise<ClientBasedAuth>;

export const userAuthProvider = (): Promise<ClientBasedAuth> => {
  if (userAuthProviderPromiseCache) {
    return userAuthProviderPromiseCache;
  }

  const url =
    'https://api-private.dev.atlassian.com/media-playground/api/token/user/impersonation';

  userAuthProviderPromiseCache = fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(({ clientId, token }) => {
      return {
        clientId,
        token,
      };
    });
  return userAuthProviderPromiseCache;
};
