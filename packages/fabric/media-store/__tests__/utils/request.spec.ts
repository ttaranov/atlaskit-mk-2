import 'whatwg-fetch';
import fetchMock = require('fetch-mock');

import { request } from '../../src/utils/request';

describe('request', () => {
  const url = 'http://some-url';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';

  beforeEach(() => fetchMock.mock(`*`, {}));

  afterEach(() => fetchMock.restore());

  it('should call fetch with GET method given url only', () => {
    return request(url).then(() => {
      expect(fetchMock.lastUrl()).toEqual(url);
      expect(fetchMock.lastOptions()).toEqual({ method: 'GET' });
    });
  });

  it('should call fetch with auth query parameters given GET request and client based auth', () => {
    return request(url, { method: 'GET', auth: { clientId, token } }).then(
      () => {
        expect(fetchMock.lastUrl()).toEqual(
          `${url}?client=${clientId}&token=${token}`,
        );
        expect(fetchMock.lastOptions()).toEqual({ method: 'GET' });
      },
    );
  });

  it('should call fetch with auth query parameters given GET request and asap based auth', () => {
    return request(url, { method: 'GET', auth: { asapIssuer, token } }).then(
      () => {
        expect(fetchMock.lastUrl()).toEqual(
          `${url}?issuer=${asapIssuer}&token=${token}`,
        );
        expect(fetchMock.lastOptions()).toEqual({ method: 'GET' });
      },
    );
  });

  it('should call fetch with auth headers given POST request and client based auth', () => {
    return request(url, { method: 'POST', auth: { clientId, token } }).then(
      () => {
        expect(fetchMock.lastUrl()).toEqual(`${url}`);
        expect(fetchMock.lastOptions()).toEqual({
          method: 'POST',
          headers: {
            'X-Client-Id': clientId,
            Authorization: `Bearer ${token}`,
          },
        });
      },
    );
  });

  it('should call fetch with auth headers given GET request and asap based auth', () => {
    return request(url, { method: 'POST', auth: { asapIssuer, token } }).then(
      () => {
        expect(fetchMock.lastUrl()).toEqual(`${url}`);
        expect(fetchMock.lastOptions()).toEqual({
          method: 'POST',
          headers: {
            'X-Issuer': asapIssuer,
            Authorization: `Bearer ${token}`,
          },
        });
      },
    );
  });
});
