import * as sinon from 'sinon';

import createRequest from '../../services/util/createRequest';
import { Auth, AuthProvider } from '@atlaskit/media-store';
import * as UtilsModule from '../../utils';

describe('createRequest()', () => {
  const token = 'ABC';
  const baseUrl = 'http://example.com';
  const clientId = '1234';
  let authProvider: AuthProvider;
  let mockServer: sinon.SinonFakeServer;

  beforeEach(() => {
    mockServer = sinon.fakeServer.create();
    mockServer.autoRespond = true;

    authProvider = jest.fn(() =>
      Promise.resolve<Auth>({
        token,
        clientId,
        baseUrl,
      }),
    );
  });

  afterEach(() => {
    mockServer.restore();
  });

  it('should allow to cancel a request', cb => {
    const request = createRequest({
      config: { authProvider },
    });

    mockServer.respondWith('GET', 'http://example.com/', '{}');

    const { response, cancel } = request({ url: '/' });
    cancel();

    response.then(() => cb.fail('test should have failed'), () => cb());
  });

  describe('with clientId/token auth method', () => {
    const clientId = '1234';

    beforeEach(() => {
      authProvider = jest.fn(() =>
        Promise.resolve<Auth>({
          token,
          clientId,
          baseUrl,
        }),
      );
    });

    it('should send the client ID and auth token in header fields by default', () => {
      const request = createRequest({
        config: {
          authProvider,
        },
      });

      mockServer.respondWith('GET', 'http://example.com/some-api/links', '{}');

      return request({ url: '/some-api/links' }).response.then(() => {
        expect(authProvider).toHaveBeenCalled();
        expect(mockServer.requests).toHaveLength(1);
        expect(mockServer.requests[0].requestHeaders['X-Client-Id']).toBe(
          clientId,
        );
        expect(mockServer.requests[0].requestHeaders['Authorization']).toBe(
          `Bearer ${token}`,
        );
      });
    });

    it('should send auth arguments using queryParams when preventPreflight is true', () => {
      const request = createRequest({
        config: {
          authProvider,
        },
        preventPreflight: true,
      });

      mockServer.respondWith(
        'GET',
        `http://example.com/some-api/links?token=${token}&client=${clientId}`,
        '{}',
      );

      return request({ url: '/some-api/links' }).response.then(() => {
        expect(authProvider).toHaveBeenCalled();
        expect(
          mockServer.requests[0].requestHeaders['X-Client-Id'],
        ).toBeUndefined();
        expect(
          mockServer.requests[0].requestHeaders['Authorization'],
        ).toBeUndefined();
      });
    });
  });

  describe('with asapIssuer/token auth method', () => {
    const asapIssuer = 'some-issuer';

    beforeEach(() => {
      authProvider = jest.fn(() =>
        Promise.resolve<Auth>({ token, asapIssuer, baseUrl }),
      );
    });

    it('should send the asap issuer and auth token in header fields by default', () => {
      const request = createRequest({
        config: {
          authProvider,
        },
      });

      mockServer.respondWith('GET', `http://example.com/some-api/links`, '{}');

      return request({ url: '/some-api/links' }).response.then(() => {
        expect(authProvider).toHaveBeenCalled();
        expect(mockServer.requests[0].requestHeaders['X-Issuer']).toBe(
          asapIssuer,
        );
        expect(mockServer.requests[0].requestHeaders['Authorization']).toBe(
          `Bearer ${token}`,
        );
      });
    });

    it('should send auth arguments using queryParams when preventPreflight is true', () => {
      const request = createRequest({
        config: {
          authProvider,
        },
        preventPreflight: true,
      });

      mockServer.respondWith(
        'GET',
        `http://example.com/some-api/links?token=${token}&issuer=${asapIssuer}`,
        '{}',
      );

      return request({ url: '/some-api/links' }).response.then(() => {
        expect(authProvider).toHaveBeenCalled();
        expect(
          mockServer.requests[0].requestHeaders['X-Issuer'],
        ).toBeUndefined();
        expect(
          mockServer.requests[0].requestHeaders['Authorization'],
        ).toBeUndefined();
      });
    });
  });

  describe('with responseType === image', () => {
    let checkWebpSupportSpy: jest.SpyInstance<any>;
    beforeEach(() => {
      checkWebpSupportSpy = jest.spyOn(UtilsModule, 'checkWebpSupport');
    });

    afterEach(() => {
      checkWebpSupportSpy.mockRestore();
    });

    describe('when webp support is enabled', () => {
      beforeEach(() => {
        checkWebpSupportSpy.mockReturnValue(Promise.resolve(true));
      });

      it('should add webp headers', () => {
        const request = createRequest({
          config: {
            authProvider,
          },
          preventPreflight: true,
        });

        mockServer.respondWith(
          'GET',
          `http://example.com/some-api/links?token=${token}&client=${clientId}`,
          '{}',
        );

        return request({
          url: '/some-api/links',
          responseType: 'image',
        }).response.then(() => {
          expect(mockServer.requests[0].requestHeaders['accept']).toBe(
            'image/webp,image/*,*/*;q=0.8',
          );
        });
      });
    });

    describe('when webp support is disabled', () => {
      beforeEach(() => {
        checkWebpSupportSpy.mockReturnValue(Promise.resolve(false));
      });

      it('should not add webp headers', () => {
        const request = createRequest({
          config: {
            authProvider,
          },
          preventPreflight: false,
        });

        mockServer.respondWith(
          'GET',
          `http://example.com/some-api/links`,
          '{}',
        );

        return request({
          url: '/some-api/links',
          responseType: 'image',
        }).response.then(() => {
          expect(mockServer.requests[0].requestHeaders['accept']).toBe(
            'image/*,*/*;q=0.8',
          );
        });
      });
    });
  });
});
