// TODO [MSW-387]: Add typings
// This method requires CORS to be disabled
import { ClientBasedAuth } from '@atlaskit/media-core';

export const userAuthProviderBaseURL = 'https://dt-api.dev.atl-paas.net';

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
  }).then(response =>
    // We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
    response.json(),
  );
  return userAuthProviderPromiseCache;
};
