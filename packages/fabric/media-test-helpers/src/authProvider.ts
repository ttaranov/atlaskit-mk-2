import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { defaultCollectionName } from './collectionNames';
import { Auth, AuthProvider, AuthContext } from '@atlaskit/media-core';

const cachedAuths: { [key: string]: Auth } = {};
const authProviderBaseURL = 'https://media-playground.dev.atl-paas.net';
export const userAuthProviderBaseURL = 'https://dt-api.dev.atl-paas.net';

export class StoryBookAuthProvider {
  static create(
    isAsapEnvironment: boolean,
    access?: { [resourceUrn: string]: string[] },
  ): AuthProvider {
    return async (authContext?: AuthContext): Promise<Auth> => {
      const collectionName =
        (authContext && authContext.collectionName) || defaultCollectionName;
      const accessStr = access ? JSON.stringify(access) : '';
      const cacheKey = `${collectionName}-${accessStr}-${isAsapEnvironment}`;

      if (cachedAuths[cacheKey]) {
        return Promise.resolve(cachedAuths[cacheKey]);
      }

      const config: AxiosRequestConfig = {
        baseURL: authProviderBaseURL,
        headers: {},
        params: {
          collection: collectionName,
          environment: isAsapEnvironment ? 'asap' : '',
        },
      };

      let response: AxiosResponse;
      if (access) {
        response = await axios.post('/token', { access }, config);
      } else {
        response = await axios.get('/token', config);
      }

      const auth = response.data as Auth;
      cachedAuths[cacheKey] = auth;
      return auth;
    };
  }
}

export class StoryBookUserAuthProvider {
  static create(apiURL: string = authProviderBaseURL) {
    return async (authContext?: AuthContext): Promise<Auth> => {
      const config: AxiosRequestConfig = {
        baseURL: apiURL,
        headers: {},
        withCredentials: true,
      };
      const cacheKey = apiURL;

      const cachedAuth = cachedAuths[cacheKey];
      if (cachedAuth) {
        return Promise.resolve(cachedAuth);
      }

      const response = await axios.get('/token/user/impersonation', config);
      const { clientId, token } = response.data;
      const auth = { clientId, token };

      cachedAuths[cacheKey] = auth;
      return auth;
    };
  }
}
