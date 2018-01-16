jest.mock('axios');

import { expect } from 'chai';
import * as sinon from 'sinon';
import axios from 'axios';

import {
  MediaClient,
  MediaClientRequest,
  isTokenError,
  addAuthToHeaders,
  addAuthToQueryParameters,
} from '../mediaClient';

describe('isTokenExpirationError', () => {
  it('should return false for an undefined error object', () => {
    expect(isTokenError(undefined)).to.equal(false);
  });

  it('should return false for an empty error object', () => {
    expect(
      isTokenError({
        error: {},
      }),
    ).to.equal(false);
  });

  it('should return false for another error', () => {
    expect(
      isTokenError({
        error: {
          code: 'Not authorized',
        },
      }),
    ).to.equal(false);
  });

  it('should return true for the token expiration error', () => {
    expect(
      isTokenError({
        error: {
          code: 'JwtAuthoriser:TokenExpiredError',
        },
      }),
    ).to.equal(true);
  });

  it('should return true for the token authentication error', () => {
    expect(
      isTokenError({
        error: {
          code: 'JwtAuthoriser:AuthenticationError',
        },
      }),
    ).to.equal(true);
  });
});

describe('addAuthToHeaders function', () => {
  const httpMethod = 'POST';
  const mediaApiMethod = 'some-method';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const auth = { clientId, token };

  it('should add headers with credentials to the existing headers', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      headers: {
        'some-header': 'some-data',
      },
    };

    const newRequest = addAuthToHeaders(originalRequest, auth);

    expect(newRequest.headers).to.deep.equal({
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

    expect(newRequest.headers).to.deep.equal({
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

    expect(newRequest.headers).to.deep.equal({
      Authorization: `Bearer ${token}`,
      'X-Client-Id': clientId,
    });
  });
});

describe('addAuthToQueryParameters function', () => {
  const httpMethod = 'POST';
  const mediaApiMethod = 'some-method';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const auth = { clientId, token };

  it('should add parameters with credentials to the existing parameters', () => {
    const originalRequest: MediaClientRequest = {
      httpMethod,
      mediaApiMethod,
      parameters: {
        'some-parameter': 'some-data',
      },
    };

    const newRequest = addAuthToQueryParameters(originalRequest, auth);

    expect(newRequest.parameters).to.deep.equal({
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

    expect(newRequest.parameters).to.deep.equal({
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

    expect(newRequest.parameters).to.deep.equal({
      client: clientId,
      token: token,
    });
  });
});

describe('MediaClient', () => {
  describe('storedToken', () => {
    const apiUrl = 'https://media.api';
    const clientId = 'client-id';
    const token = 'some-token';
    const authProvider = () => Promise.resolve({ clientId, token });

    let mediaClient: MediaClient;

    beforeEach(() => {
      mediaClient = new MediaClient(apiUrl, authProvider);
    });

    it('should be undefined by default', () => {
      expect(typeof mediaClient.storedAuth).to.equal('undefined');
    });

    it('should be equal to the provided token after token refresh', () => {
      return mediaClient.refreshAuth().then(() => {
        expect(mediaClient.storedAuth).to.deep.equal({ clientId, token });
      });
    });
  });

  describe('refreshToken', () => {
    const apiUrl = 'https://media.api';
    const token = 'some-token';

    let authProvider: sinon.SinonStub;
    let mediaClient: MediaClient;

    beforeEach(() => {
      authProvider = sinon.stub();
      mediaClient = new MediaClient(apiUrl, authProvider);
    });

    it('should call tokenProvider to get token', () => {
      authProvider.resolves(token);

      return mediaClient.refreshAuth().then(receivedToken => {
        expect(receivedToken).to.equal(token);
        expect(authProvider.callCount).to.equal(1);
      });
    });
  });

  describe('call', () => {
    const apiUrl = 'https://media.api';
    const clientId = 'some-client-id';
    const token = 'some-token';
    const auth = { clientId, token };
    const data = { item: 'item' };
    const response = { data };
    const mediaApiMethod = 'some-method';

    let authProvider: sinon.SinonStub;
    let mediaClient: MediaClient;

    beforeEach(() => {
      authProvider = sinon.stub();
      mediaClient = new MediaClient(apiUrl, authProvider);
    });

    afterEach(() => {
      (axios.request as any).mockReset();
    });

    it('should reject if token can not be retrieved', done => {
      const error = new Error('No network connection');
      authProvider.rejects(error);
      (axios.request as any).mockReturnValue(Promise.resolve(response));

      mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .catch(receivedError => {
          expect(receivedError).to.equal(error);
          done();
        });
    });

    it('should attach credentials to the request', () => {
      authProvider.resolves(auth);

      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).contain({
          Authorization: 'Bearer some-token',
          'X-Client-Id': 'some-client-id',
        });

        return Promise.resolve(response);
      });

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'PUT',
        })
        .then(receivedData => {
          expect(receivedData).to.equal(data);
        });
    });

    it('should format url and pass provided parameters to Media API', () => {
      authProvider.resolves(auth);

      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params).to.deep.equal({
          url: 'https://media.api/some-method',
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
          expect(receivedData).to.equal(data);
        });
    });

    it('should add Content-Type header if the request contains data', () => {
      authProvider.resolves(auth);

      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).to.contain({
          'Content-Type': 'application/json; charset=utf-8',
        });

        return Promise.resolve(response);
      });

      return mediaClient.call({
        mediaApiMethod,
        httpMethod: 'POST',
        data: { item: 35 },
      });
    });

    it('should not add Content-Type header if the request contains no data', () => {
      authProvider.resolves(auth);

      (axios.request as any).mockImplementationOnce((params: any) => {
        expect(params.headers).to.not.contain({
          'Content-Type': 'application/json; charset=utf-8',
        });

        return Promise.resolve(response);
      });

      return mediaClient.call({
        mediaApiMethod,
        httpMethod: 'POST',
      });
    });

    it('should retry if the error is for the expired token', () => {
      authProvider.resolves(auth);

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
          expect(receivedData).to.equal(data);
        });
    });

    it('should not retry if the error is not for the expired token', done => {
      authProvider.resolves(auth);

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
          expect(receivedError).to.equal(error);
          done();
        });
    });

    it('should not retrieve token for consecutive calls if API requests return successfully', () => {
      authProvider.onFirstCall().resolves(auth);
      authProvider.onSecondCall().rejects(new Error());

      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));
      (axios.request as any).mockReturnValueOnce(Promise.resolve(response));

      return mediaClient
        .call({
          mediaApiMethod,
          httpMethod: 'GET',
        })
        .then(receivedData => {
          expect(receivedData).to.equal(data);
          return mediaClient.call({
            mediaApiMethod,
            httpMethod: 'GET',
          });
        })
        .then(receivedData => {
          expect(receivedData).to.equal(data);
        });
    });
  });
});
