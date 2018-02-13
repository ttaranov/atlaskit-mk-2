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
    return fetch(createUrl(url, params, auth), { method, body, headers });
  } else {
    return fetch(createUrl(url, params), {
      method,
      body,
      headers: withAuth(auth)(headers),
    });
  }
}

export function mapResponseToJson(response: Response): Promise<any> {
  return response.json();
}

export function createUrl(
  baseUrl: string,
  params?: RequestParams,
  auth?: Auth,
): string {
  const url = new URL(baseUrl);

  if (params) {
    Object.keys(params).forEach(name =>
      url.searchParams.set(name, params[name]),
    );
  }

  if (auth) {
    const authParams = mapAuthToQueryParameters(auth);
    Object.keys(authParams).forEach(name =>
      url.searchParams.set(name, authParams[name]),
    );
  }

  return url.toString();
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

export default request;
