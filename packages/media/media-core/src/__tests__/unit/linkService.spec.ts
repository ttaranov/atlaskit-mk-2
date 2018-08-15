import { useFakeXMLHttpRequest } from 'sinon';

import { MediaLinkService } from '../../services/linkService';
import { UrlPreview } from '../../item';
import { Auth, AuthProvider } from '@atlaskit/media-store';

const baseUrl = 'some-host';
const token = 'some-token';

const linkId = 'some-link-id';
const clientId = 'some-client-id';
const collection = 'some-collection';
const linkUrl = 'some-url';
const linkMetadata = <UrlPreview>{
  type: 'some-type',
  url: 'some-url',
  title: 'some-title',
  description: 'some-description',
  site: 'some-site',
  author: { url: 'some-author-url', name: 'some-author-name' },
  date: 12345678,
  resources: {
    icon: { url: 'some-icon-url' },
    thumbnail: { url: 'some-thumbnail-url' },
  },
};
const authParams = `token=${token}&client=${clientId}`;

describe('MediaLinkService', () => {
  let authProvider: AuthProvider;
  let linkService: MediaLinkService;

  let xhr: any;
  let requests: Array<any>;

  const setupFakeXhr = () => {
    xhr = useFakeXMLHttpRequest();
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
    linkService = new MediaLinkService({ authProvider });
  });

  afterEach(function() {
    xhr.restore();
  });

  it('should resolve link item', () => {
    const linkServerFakedResponse = {
      id: 'some-id',
      url: 'some-url',
      createdAt: 1488017465703,
      metadata: {
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
      },
    };

    const response = linkService
      .getLinkItem(linkId, collection)
      .then(linkItem => {
        expect(linkItem.type).toBe('link');
        expect(linkItem.details.id).toBe('some-id');
        expect(linkItem.details.url).toBe('some-url');
        expect(linkItem.details.title).toBe('some-title');
        expect(linkItem.details.description).toBe('some-description');
        expect(linkItem.details.site).toBe('some-site');
        expect(linkItem.details.author).toEqual({ name: 'some-author' });
        expect(linkItem.details.date).toBe(123456);
      })
      .then(() => {
        // Validate call to token provider
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: collection,
        });
      })
      .then(() => {
        expect(requests[0].url).toBe(
          `some-host/link/some-link-id?collection=some-collection&${authParams}`,
        );
      });
    setTimeout(() => {
      const mockedResponse = {
        data: linkServerFakedResponse,
      };
      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(mockedResponse),
      );
    });
    return response;
  });

  it('should reject get link when server responded with 500', () => {
    const response = linkService
      .getLinkItem('some-dodgy-link-id', collection)
      .then(
        () => {
          throw new Error('The function getLinkItem should fail');
        },
        error => expect(error).toBeDefined(),
      );

    setTimeout(() => {
      requests[0].respond(500, {}, '');
    });
    return response;
  });

  it('should add link', () => {
    const response = linkService
      .addLinkItem(linkUrl, collection, linkMetadata)
      .then(id => {
        expect(id).toBe(linkId);
      })
      .then(() => {
        // Validate call to token provider
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: collection,
        });
      })
      .then(() => {
        const headers = requests[0].requestHeaders;
        expect(headers['X-Client-Id']).toBe(clientId);
        expect(headers['Authorization']).toBe(`Bearer ${token}`);
        expect(requests[0].url).toBe(
          'some-host/link?collection=some-collection',
        );
      });

    setTimeout(() => {
      const mockedResponse = {
        data: { id: linkId },
      };
      requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(mockedResponse),
      );
    });

    return response;
  });

  it('should reject add link when server responded with 500', () => {
    const response = linkService
      .addLinkItem(linkUrl, collection, linkMetadata)
      .then(() => {
        throw new Error('The function addLinkItem should fail');
      }, error => expect(error).toBeDefined);

    setTimeout(() => {
      requests[0].respond(500, {}, '');
    });

    return response;
  });
});
