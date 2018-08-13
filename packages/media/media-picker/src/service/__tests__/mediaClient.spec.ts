jest.mock('axios');

import axios from 'axios';
import { Auth, AuthProvider } from '@atlaskit/media-core';

import {
  MediaClient,
  MediaClientRequest,
  isTokenError,
  addAuthToHeaders,
  addAuthToQueryParameters,
} from '../mediaClient';

const clientId = 'some-client-id';
const token = 'some-token';
const baseUrl = 'some-base-url';
const auth: Auth = { clientId, token, baseUrl };

describe('isTokenExpirationError', () => {
  it('should return false for an undefined error object', () => {
    expect(isTokenError(undefined)).toEqual(false);
  });

  it('should return false for an empty error object', () => {
    expect(
      isTokenError({
        error: {},
      }),
    ).toEqual(false);
  });

  it('should return false for another error', () => {
    expect(
      isTokenError({
        error: {
          code: 'Not authorized',
        },
      }),
    ).toEqual(false);
  });

  it('should return true for the token expiration error', () => {
    expect(
      isTokenError({
        error: {
          code: 'JwtAuthoriser:TokenExpiredError',
        },
      }),
    ).toEqual(true);
  });

  it('should return true for the token authentication error', () => {
    expect(
      isTokenError({
        error: {
          code: 'JwtAuthoriser:AuthenticationError',
        },
      }),
    ).toEqual(true);
  });
});

describe('addAuthToHeaders function', () => {
  const httpMethod = 'POST';
  const mediaApiMethod = 'some-method';

  it('should add headers with credentials to the existing headers', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      headers: {
        'some-header': 'some-data',
      },
    };

    const newRequest = addAuthToHeaders(originalRequest, auth);

    expect(newRequest.headers).toEqual({
      'some-header': 'some-data',
      Authorization: `Bearer ${token}`,
      'X-Client-Id': clientId,
    });
  });

  it('should add headers with credentials if "headers" is undefined in the original request', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
    };

    const newRequest = addAuthToHeaders(originalRequest, auth);

    expect(newRequest.headers).toEqual({
      Authorization: `Bearer ${token}`,
      'X-Client-Id': clientId,
    });
  });

  it('should replace headers with credentials if authorization headers were specified in the original request', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      headers: {
        Authorization: 'Bearer some-other-token',
        'X-Client-Id': 'some-other-client-id',
      },
    };

    const newRequest = addAuthToHeaders(originalRequest, auth);

    expect(newRequest.headers).toEqual({
      Authorization: `Bearer ${token}`,
      'X-Client-Id': clientId,
    });
  });
});

describe('addAuthToQueryParameters function', () => {
  const httpMethod = 'POST';
  const mediaApiMethod = 'some-method';

  it('should add parameters with credentials to the existing parameters', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      parameters: {
        'some-parameter': 'some-data',
      },
    };

    const newRequest = addAuthToQueryParameters(originalRequest, auth);

    expect(newRequest.parameters).toEqual({
      'some-parameter': 'some-data',
      client: clientId,
      token: token,
    });
  });

  it('should add parameters with credentials if "parameters" is undefined in the original request', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
    };

    const newRequest = addAuthToQueryParameters(originalRequest, auth);

    expect(newRequest.parameters).toEqual({
      client: clientId,
      token: token,
    });
  });

  it('should replace parameters with credentials if authorization parameters were specified in the original request', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      parameters: {
        client: 'some-other-client',
        token: 'some-other-token',
      },
    };

    const newRequest = addAuthToQueryParameters(originalRequest, auth);

    expect(newRequest.parameters).toEqual({
      client: clientId,
      token: token,
    });
  });
});

describe('MediaClient', () => {
  describe('storedToken', () => {
    const authProvider: AuthProvider = () =>
      Promise.resolve({ clientId, token, baseUrl });

    let mediaClient: MediaClient;

    beforeEach(() => {
      mediaClient = new MediaClient(authProvider);
    });

    it('should be undefined by default', () => {
      expect(typeof mediaClient.storedAuth).toEqual('undefined');
    });

    it('should be equal to the provided token after token refresh', () => {
      return mediaClient.refreshAuth().then(() => {
        expect(mediaClient.storedAuth).toEqual({ clientId, token, baseUrl });
      });
    });
  });

  describe('refreshToken', () => {
    let authProvider: jest.Mock<any>;
    let mediaClient: MediaClient;

    beforeEach(() => {
      authProvider = jest.fn(() =>
        Promise.resolve<Auth>({ clientId, token, baseUrl }),
      );
      mediaClient = new MediaClient(authProvider);
    });

    it('should call tokenProvider to get token', () => {
      return mediaClient.refreshAuth().then(receivedToken => {
        expect(receivedToken).toEqual(auth);
        expect(authProvider).toHaveBeenCalled();
      });
    });
  });

  describe('call', () => {
    const auth: Auth = { clientId, token, baseUrl };
    const data = { item: 'item' };
    const response = { data };
    const mediaApiMethod = 'some-method';

    let authProvider: jest.Mock<any>;
    let mediaClient: MediaClient;

    beforeEach(() => {
      authProvider = jest.fn(() => Promise.resolve<Auth>(auth));
      mediaClient = new MediaClient(authProvider);
    });

    afterEach(() => {
      (axios.request as any).mockReset();
    });

    it('should reject if token can not be retrieved', done => {
      const error = new Error('No network connection');
      authProvider.mockReturnValue(Promise.reject(error));
      (axios.request as any).mockReturnValue(Promise.resolve(response));

      mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .catch(receivedError => {
          expect(receivedError).toEqual(error);
          done();
        });
    });

    it('should attach credentials to the request', () => {
      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).toEqual(
          expect.objectContaining({
            Authorization: 'Bearer some-token',
            'X-Client-Id': 'some-client-id',
          }),
        );

        return Promise.resolve(response);
      });

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'PUT',
        })
        .then(receivedData => {
          expect(receivedData).toEqual(data);
        });
    });

    it('should format url and pass provided parameters to Media API', () => {
      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params).toEqual({
          url: 'some-base-url/some-method',
          method: 'POST',
          headers: {
            'first-header': 'first-header-value',
            'second-header': 'second-header-value',
            Authorization: 'Bearer some-token',
            'X-Client-Id': 'some-client-id',
            'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
            'first-param': 'first-param-value',
            'second-param': 'second-param-value',
          },
          data: {
            'first-field': 'first-value',
            'second-field': 'second-value',
          },
        });

        return Promise.resolve(response);
      });

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'POST',
          headers: {
            'first-header': 'first-header-value',
            'second-header': 'second-header-value',
          },
          parameters: {
            'first-param': 'first-param-value',
            'second-param': 'second-param-value',
          },
          data: {
            'first-field': 'first-value',
            'second-field': 'second-value',
          },
        })
        .then(receivedData => {
          expect(receivedData).toEqual(data);
        });
    });

    it('should add Content-Type header if the request contains data', () => {
      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).toEqual(
          expect.objectContaining({
            'Content-Type': 'application/json; charset=utf-8',
          }),
        );

        return Promise.resolve(response);
      });

      return mediaClient.call({
        mediaApiMethod,
        httpMethod: 'POST',
        data: { item: 35 },
      });
    });

    it('should not add Content-Type header if the request contains no data', () => {
      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).not.toEqual(
          expect.objectContaining({
            'Content-Type': 'application/json; charset=utf-8',
          }),
        );

        return Promise.resolve(response);
      });

      return mediaClient.call({
        mediaApiMethod,
        httpMethod: 'POST',
      });
    });

    it('should retry if the error is for the expired token', () => {
      const error = new Error();
      (error as any)['response'] = {
        data: {
          error: {
            code: 'JwtAuthoriser:TokenExpiredError',
          },
        },
      };
      (axios.request as any).mockReturnValueOnce(Promise.reject(error));
      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .then(receivedData => {
          expect(receivedData).toEqual(data);
        });
    });

    it('should not retry if the error is not for the expired token', done => {
      const error = new Error();
      (error as any)['response'] = {
        data: {
          error: {
            code: 'No network',
          },
        },
      };
      (axios.request as any).mockReturnValueOnce(Promise.reject(error));
      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .catch(receivedError => {
          expect(receivedError).toEqual(error);
          done();
        });
    });

    it('should not retrieve token for consecutive calls if API requests return successfully', () => {
      authProvider.mockReturnValueOnce(Promise.resolve(auth));
      authProvider.mockReturnValue(Promise.reject(new Error()));

      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));
      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .then(receivedData => {
          expect(receivedData).toEqual(data);
          return mediaClient.call({
            mediaApiMethod,
            httpMethod: 'GET',
          });
        })
        .then(receivedData => {
          expect(receivedData).toEqual(data);
        });
    });
  });
});
