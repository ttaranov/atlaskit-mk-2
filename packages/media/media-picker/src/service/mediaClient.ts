import { AxiosRequestConfig, default as axios } from 'axios';
import { Auth, AuthProvider } from '@atlaskit/media-core';

import { mapAuthToAuthHeaders, mapAuthToQueryParameters } from '../domain/auth';

export interface MediaApiError {
  error: {
    code?: string;
    title?: string;
  };
}

const tokenExpirationCode = 'JwtAuthoriser:TokenExpiredError';
const tokenAuthenticationCode = 'JwtAuthoriser:AuthenticationError';

export const isTokenError = (apiError?: MediaApiError): boolean => {
  if (apiError && apiError.error) {
    const { code } = apiError.error;
    return code === tokenExpirationCode || code === tokenAuthenticationCode;
  }

  return false;
};

export type MediaClientRequestHeaders = { [header: string]: any };
export type MediaClientRequestParameters = { [parameter: string]: any };

export interface MediaClientRequest {
  httpMethod: 'GET' | 'POST' | 'PUT';
  mediaApiMethod: string; // e.g. 'file'
  headers?: MediaClientRequestHeaders;
  parameters?: MediaClientRequestParameters;
  data?: { [key: string]: any };
}

export interface MediaClientResponse {
  data: any;
}

// Functions allowing to apply authorization parameters
export type AddAuth = (
  request: MediaClientRequest,
  auth: Auth,
) => MediaClientRequest;

export const addAuthToHeaders = (
  request: MediaClientRequest,
  auth: Auth,
): MediaClientRequest => {
  const currentHeaders: MediaClientRequestHeaders = request.headers || {};

  return {
    ...request,
    headers: {
      ...currentHeaders,
      ...mapAuthToAuthHeaders(auth),
    },
  };
};

export const addAuthToQueryParameters = (
  request: MediaClientRequest,
  auth: Auth,
): MediaClientRequest => {
  return {
    ...request,
    parameters: {
      ...request.parameters,
      ...mapAuthToQueryParameters(auth),
    },
  };
};

export class MediaClient {
  private auth?: Auth;

  constructor(
    private readonly authProvider: AuthProvider,
    private readonly collection?: string,
  ) {}

  get storedAuth(): Auth | undefined {
    return this.auth;
  }

  refreshAuth(): Promise<Auth> {
    return this.authProvider({
      collectionName: this.collection,
    }).then(auth => {
      this.auth = auth;
      return auth;
    });
  }

  call(
    request: MediaClientRequest,
    addAuth: AddAuth = addAuthToHeaders,
  ): Promise<MediaClientResponse> {
    return this.makeCall(request, addAuth).catch(error => {
      const isTokenExpired =
        error && error.response && isTokenError(error.response.data);
      if (!isTokenExpired) {
        throw error;
      }

      // Retry if the token has expired
      return this.makeCall(request, addAuth, true);
    });
  }

  private makeCall(
    request: MediaClientRequest,
    addAuth: AddAuth,
    forceRefreshToken: boolean = false,
  ): Promise<MediaClientResponse> {
    return this.getAuth(forceRefreshToken).then(auth =>
      this.makeCallWithToken(request, addAuth, auth),
    );
  }

  private getAuth(forceRefresh: boolean = false): Promise<Auth> {
    if (this.auth && !forceRefresh) {
      return Promise.resolve(this.auth);
    }

    return this.refreshAuth();
  }

  private async makeCallWithToken(
    request: MediaClientRequest,
    addAuth: AddAuth,
    auth: Auth,
  ): Promise<MediaClientResponse> {
    const requestWithAuth = addAuth(request, auth);
    const config = this.getAxiosRequestConfig(requestWithAuth, auth.baseUrl);
    const response = await axios.request(config);
    return response.data as MediaClientResponse;
  }

  private getAxiosRequestConfig(
    request: MediaClientRequest,
    baseUrl: string,
  ): AxiosRequestConfig {
    const { httpMethod, mediaApiMethod, parameters, headers, data } = request;
    return {
      url: `${baseUrl}/${mediaApiMethod}`,
      method: httpMethod,
      headers: {
        ...headers,
        ...(data ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
      },
      params: parameters,
      data,
    };
  }
}
