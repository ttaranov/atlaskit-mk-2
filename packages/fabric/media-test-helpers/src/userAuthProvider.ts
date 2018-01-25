// TODO [MSW-387]: Add typings
// This method requires CORS to be disabled
import { ClientBasedAuth } from '@atlaskit/media-core';
import axios from 'axios';
export const userAuthProvider = (): Promise<ClientBasedAuth> => {
  const url =
    'https://media-playground.dev.atl-paas.net/token/user/impersonation';

  return axios
    .get(url, {
      method: 'GET',
      withCredentials: true,
    })
    .then(response => response.data)
    .then(({ clientId, token }) => {
      return {
        clientId,
        token,
      };
    });
};
