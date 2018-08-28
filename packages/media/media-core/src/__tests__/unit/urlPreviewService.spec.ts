import * as sinon from 'sinon';

import { MediaUrlPreviewService } from '../../services/urlPreviewService';
import { Auth, AuthProvider } from '@atlaskit/media-store';

const baseUrl = 'some-host';
const token = 'some-token';
const clientId = 'some-client-id';

describe('UrlPreviewService', () => {
  let authProvider: AuthProvider;
  let urlPreviewService: MediaUrlPreviewService;

  let xhr: any;
  let requests: Array<any>;

  const setupFakeXhr = () => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function(xhr: any) {
      requests.push(xhr);
    };
  };

  beforeEach(() => {
    setupFakeXhr();
    authProvider = jest.fn(() =>
      Promise.resolve<Auth>({
        token,
        clientId,
        baseUrl,
      }),
    );
    urlPreviewService = new MediaUrlPreviewService({
      authProvider,
    });
  });

  afterEach(function() {
    xhr.restore();
  });

  it('should resolve a preview', () => {
    const linkPreviewResponse = {
      url: 'some-url',
      type: 'link',
      title: 'some-title',
      description: 'some-description',
      site: 'some-site',
      author: {
        name: 'some-author',
      },
      date: 123456,
      resources: {
        thumbnail: {
          url: 'some-file-url',
          type: 'image/jpeg',
          width: 300,
          height: 200,
          length: 5012,
        },
      },
    };

    const response = urlPreviewService
      .getUrlPreview('http://atlassian.com')
      .then(preview => {
        expect(preview).toEqual(linkPreviewResponse);
      })
      .then(() => {
        // Validate call to token provider with no parameters
        expect(authProvider).toHaveBeenCalledTimes(1);
      })
      .then(() => {
        const headers = requests[0].requestHeaders;
        expect(headers['X-Client-Id']).toBe(clientId);
        expect(headers['Authorization']).toBe(`Bearer ${token}`);
        expect(requests[0].url).toBe(
          'some-host/link/preview?url=http:%2F%2Fatlassian.com',
        );
      });

    setTimeout(() => {
      const mockedResponse = {
        data: {
          preview: linkPreviewResponse,
        },
      };
      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(mockedResponse),
      );
    });

    return response;
  });

  it('should resolve an error when iFramely fails to process provided link', () => {
    const expectedError = '417: Some cray cray error occured';

    const response = urlPreviewService
      .getUrlPreview('http://atlassian.com')
      .catch(actualError => {
        expect(actualError.message).toEqual(expectedError);
      })
      .then(() => {
        // Validate call to token provider with no parameters
        expect(authProvider).toHaveBeenCalledTimes(1);
      })
      .then(() => {
        const headers = requests[0].requestHeaders;
        expect(headers['X-Client-Id']).toBe(clientId);
        expect(headers['Authorization']).toBe(`Bearer ${token}`);
        expect(requests[0].url).toBe(
          'some-host/link/preview?url=http:%2F%2Fatlassian.com',
        );
      });

    setTimeout(() => {
      const mockedResponse = {
        data: {
          previewError: {
            code: '417',
            name: 'Some cray cray error occured',
          },
        },
      };
      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(mockedResponse),
      );
    });

    return response;
  });
});
