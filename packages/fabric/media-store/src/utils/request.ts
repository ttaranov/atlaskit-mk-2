import { parse, stringify } from 'query-string';

import { Auth } from '../models/auth';
import { mapAuthToQueryParameters } from '../models/auth-query-parameters';
import { mapAuthToAuthHeaders } from '../models/auth-headers';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestParams = { [key: string]: any };

export type RequestHeaders = { [key: string]: string };

export type RequestOptions = {
  readonly method?: RequestMethod;
  readonly auth?: Auth;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
};

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  method: 'GET',
};

export function request(
  url: string,
  options: RequestOptions = DEFAULT_REQUEST_OPTIONS,
): Promise<Response> {
  const { method, auth, params, headers, body } = options;

  if (method === 'GET') {
    return fetch(createUrl(url, { params, auth }), { method, body, headers });
  } else {
    return fetch(createUrl(url, { params }), {
      method,
      body,
      headers: withAuth(auth)(headers),
    });
  }
}

export function mapResponseToJson(response: Response): Promise<any> {
  return response.json();
}

export function mapResponseToVoid(response: Response): Promise<void> {
  return Promise.resolve();
}

export type CreateUrlOptions = {
  readonly params?: RequestParams;
  readonly auth?: Auth;
};

export function createUrl(
  url: string,
  { params, auth }: CreateUrlOptions = {},
): string {
  const { baseUrl, queryParams } = extract(url);
  const authParams = auth && mapAuthToQueryParameters(auth);
  const queryString = stringify({
    ...queryParams,
    ...params,
    ...authParams,
  });
  const shouldAppendQueryString = queryString.length > 0;

  return `${baseUrl}${shouldAppendQueryString ? `?${queryString}` : ''}`;
}

function withAuth(auth?: Auth) {
  return (headers?: RequestHeaders): RequestHeaders | undefined => {
    if (auth) {
      return {
        ...headers,
        ...mapAuthToAuthHeaders(auth),
      };
    } else {
      return headers;
    }
  };
}

function extract(url: string): { baseUrl: string; queryParams?: any } {
  const index = url.indexOf('?');

  if (index > 0) {
    return {
      baseUrl: url.substring(0, index),
      queryParams: parse(url.substring(index + 1, url.length)),
    };
  } else {
    return {
      baseUrl: url,
    };
  }
}

export default request;
