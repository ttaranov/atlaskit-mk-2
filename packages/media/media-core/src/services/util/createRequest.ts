import axios from 'axios';
import {
  Auth,
  isAsapBasedAuth,
  isClientBasedAuth,
  MediaApiConfig,
} from '@atlaskit/media-store';
import { checkWebpSupport } from '../../utils';

export type ResponseType = 'json' | 'image';

export type CreateRequestFunc = (requestOptions: RequestOptions) => Response;
export type Response<R = any> = {
  response: Promise<R>;
  cancel: (message?: string) => void;
};

export interface RequesterOptions {
  collectionName?: string;
  preventPreflight?: boolean;
  config: MediaApiConfig;
}

export interface RequestOptions {
  method?: string;
  url: string;
  params?: Object;
  headers?: Object;
  data?: Object;
  responseType?: ResponseType;
}
const addAcceptHeader = (headers: any) =>
  checkWebpSupport().then(isWebpSupported => {
    // q=0.8 stands for 'quality factor' => http://stackoverflow.com/a/10496722
    if (isWebpSupported) {
      headers.accept = 'image/webp,image/*,*/*;q=0.8';
    } else {
      headers.accept = 'image/*,*/*;q=0.8';
    }

    return headers;
  });

const buildHeaders = (
  auth: Auth,
  baseHeaders?: Object,
  preventPreflight?: boolean,
  responseType?: ResponseType,
): Promise<object> => {
  const headers: any = {
    ...baseHeaders,
    'Content-Type': 'application/json',
  };

  // We can add custom headers if we don't want to avoid preflight - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
  if (!preventPreflight) {
    if (isAsapBasedAuth(auth)) {
      headers['X-Issuer'] = auth.asapIssuer;
    } else if (isClientBasedAuth(auth)) {
      headers['X-Client-Id'] = auth.clientId;
    }
    headers['Authorization'] = `Bearer ${auth.token}`;
  }

  if (responseType === 'image') {
    return addAcceptHeader(headers);
  }

  return Promise.resolve(headers);
};

const buildParams = (
  auth: Auth,
  baseParams?: Object,
  preventPreflight?: boolean,
  collection?: string,
): Promise<object> => {
  const authParams = {} as any;

  if (preventPreflight) {
    authParams.token = auth.token;
    if (isClientBasedAuth(auth)) {
      authParams.client = auth.clientId;
    } else if (isAsapBasedAuth(auth)) {
      authParams.issuer = auth.asapIssuer;
    }
  }

  return Promise.resolve({
    collection,
    ...baseParams,
    ...authParams,
  });
};

const responseTypeToAxios = (responseType?: ResponseType): string => {
  responseType = responseType || 'json';

  const responseTypeMap = {
    image: 'blob',
    json: 'json',
  };

  return responseTypeMap[responseType];
};

export default (requesterOptions: RequesterOptions): CreateRequestFunc => {
  const {
    preventPreflight,
    collectionName,
    config: { authProvider },
  } = requesterOptions;

  return requestOptions => {
    const { url, headers, params, responseType, method, data } = requestOptions;
    const acquireAuth: Promise<Auth> = authProvider({ collectionName });

    const createHeadersAndParams = (auth: Auth) =>
      Promise.all([
        buildHeaders(auth, headers, preventPreflight, responseType),
        buildParams(auth, params, preventPreflight, collectionName),
        auth.baseUrl,
      ]);

    const source = axios.CancelToken.source();
    const sendAxiosRequest = ([headers, params, baseUrl]: [
      object,
      object,
      string
    ]) =>
      axios({
        method: method || 'get',
        url,
        baseURL: baseUrl,
        headers,
        params,
        data,
        responseType: responseTypeToAxios(responseType),
        cancelToken: source.token,
      });

    const response = acquireAuth
      .then(createHeadersAndParams)
      .then(sendAxiosRequest)
      .then(response => response.data);

    const cancel = (message?: string) => source.cancel(message);

    return { response, cancel };
  };
};
