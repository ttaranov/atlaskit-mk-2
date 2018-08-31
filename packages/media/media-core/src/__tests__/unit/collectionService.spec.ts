import { useFakeXMLHttpRequest, SinonFakeXMLHttpRequest } from 'sinon';
import {
  MediaCollectionService,
  DEFAULT_COLLECTION_PAGE_SIZE,
} from '../../services/collectionService';
import { MediaApiConfig } from '@atlaskit/media-store';

const clientId = 'some-client-id';
const collectionName = 'some-collection-name';
const token = 'some-token';
const baseUrl = 'some-service-host';
const authParams = `token=${token}&client=${clientId}`;
const config: MediaApiConfig = {
  authProvider: () =>
    Promise.resolve({
      token,
      clientId,
      baseUrl,
    }),
};

describe('MediaCollectionService', () => {
  let xhr: SinonFakeXMLHttpRequest;
  let requests: Array<SinonFakeXMLHttpRequest>;

  beforeEach(() => {
    xhr = useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = request => {
      requests.push(request);
    };
  });

  afterEach(() => {
    xhr.restore();
  });

  const respond = (
    body: string,
    status = 200,
    headers = { 'Content-Type': 'application/json' },
    index = 0,
  ) => {
    setTimeout(() => requests[index].respond(status, headers, body));
  };

  it('should have correct url', () => {
    const collectionService: MediaCollectionService = new MediaCollectionService(
      config,
    );
    const response = collectionService
      .getCollectionItems(collectionName)
      .then(() => {
        const request = requests[0];
        expect(request.url).toBe(
          `${baseUrl}/collection/${collectionName}/items?collection=${collectionName}&limit=${DEFAULT_COLLECTION_PAGE_SIZE}&${authParams}`,
        );
      });

    respond(JSON.stringify(Mocks.collectionItemsResponse));

    return response;
  });

  it('should have correct query parameters', () => {
    const limit = 36;
    const inclusiveStartKey = '128';
    const sortDirection = 'desc';
    const details = 'full';
    const collectionService: MediaCollectionService = new MediaCollectionService(
      config,
    );
    const response = collectionService
      .getCollectionItems(
        collectionName,
        limit,
        inclusiveStartKey,
        sortDirection,
        details,
      )
      .then(() => {
        const request = requests[0];

        expect(request.url).toBe(
          `${baseUrl}/collection/${collectionName}/items?collection=${collectionName}&limit=${limit}&` +
            `inclusiveStartKey=${inclusiveStartKey}&sortDirection=${sortDirection}&details=${details}&${authParams}`,
        );
      });

    respond(JSON.stringify(Mocks.collectionItemsResponse));

    return response;
  });

  it('should have correct response', () => {
    const collectionService: MediaCollectionService = new MediaCollectionService(
      config,
    );
    const response = collectionService
      .getCollectionItems(collectionName)
      .then(response => {
        expect(response).toEqual({
          items: [
            {
              type: 'file',
              details: {
                mimeType: 'application/video',
                id: '0a6f64e4-7330-4dcf-ac65-58ab10677282',
                occurrenceKey: 'urn:hipchat:message:12413532',
                name: 'some_video.mp4',
                size: 34315,
              },
            },
          ],
          nextInclusiveStartKey: '121',
        });
      });

    respond(JSON.stringify(Mocks.collectionItemsResponse));

    return response;
  });

  it('should filter empty files', () => {
    const collectionService: MediaCollectionService = new MediaCollectionService(
      config,
    );
    const response = collectionService
      .getCollectionItems(collectionName)
      .then(response => {
        expect(response).toEqual({
          items: [
            {
              type: 'file',
              details: {
                mimeType: 'application/video',
                id: '0a6f64e4-7330-4dcf-ac65-58ab10677282',
                occurrenceKey: 'urn:hipchat:message:12413532',
                name: 'some_video.mp4',
                size: 34315,
              },
            },
          ],
          nextInclusiveStartKey: '121',
        });
      });

    respond(JSON.stringify(Mocks.collectionWithInvalidItemsResponse));

    return response;
  });
});

const fullDetailsFile = {
  type: 'file',
  id: '0a6f64e4-7330-4dcf-ac65-58ab10677282',
  occurrenceKey: 'urn:hipchat:message:12413532',
  details: {
    mimeType: 'application/video',
    name: 'some_video.mp4',
    size: 34315,
  },
  author: {
    id: '123456:290a88b6-c6f4-4e41-a0ec-e9c75ccf4e92',
    userName: 'john',
    displayName: 'John Jackson',
    active: true,
  },
};
const noSizeFile = {
  type: 'file',
  id: '2',
  occurrenceKey: 'occurrenceKey-2',
  details: {
    mimeType: 'application/video',
    name: 'some_video.mp4',
    size: 0,
  },
};
const noDetailsFile = {
  type: 'file',
  id: '3',
  occurrenceKey: 'occurrenceKey-3',
};

class Mocks {
  static collectionItemsResponse = {
    data: {
      nextInclusiveStartKey: '121',
      contents: [fullDetailsFile],
    },
  };
  static collectionWithInvalidItemsResponse = {
    data: {
      nextInclusiveStartKey: '121',
      contents: [fullDetailsFile, noSizeFile, noDetailsFile],
    },
  };
}
