// TODO [MSW-387]: Add typings
// This method requires CORS to be disabled
import { ClientBasedAuth } from '@atlaskit/media-core';
export const userAuthProvider = (): Promise<ClientBasedAuth> => {
  const url =
    'https://media-playground.internal.app.dev.atlassian.io/token/user/impersonation';

  return fetch(url, {
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
};
