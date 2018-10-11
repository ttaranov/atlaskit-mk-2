import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import ServiceProvider from '../../provider/service-provider';
import {
  docId,
  providerUrl,
  validContent,
  validGetResponse,
  validPutResponse,
  updatedContent,
  objectId,
} from './_test-helpers';

describe('ServiceProvider', () => {
  let serviceProvider;

  beforeAll(() => {
    serviceProvider = new ServiceProvider({
      url: providerUrl,
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getDocument', () => {
    beforeAll(() => {
      fetchMock.get({
        matcher: `begin:${providerUrl}`,
        response: (url: string) => {
          if (url === `${providerUrl}/document/${docId}/`) {
            return validGetResponse;
          }

          return 404;
        },
      });
    });

    it('should return document from service if it exist', async () => {
      const response = await serviceProvider.getDocument(docId);
      expect(response).toEqual(validGetResponse);
    });

    it('should return null if document does not exist', async () => {
      const response = await serviceProvider.getDocument('does-not-exist');
      expect(response).toEqual(null);
    });
  });

  describe('updateDocument', () => {
    beforeAll(() => {
      fetchMock.put({
        matcher: `begin:${providerUrl}`,
        response: (url: string) => {
          if (url === `${providerUrl}/document/${docId}`) {
            return validPutResponse;
          }

          return 500;
        },
      });
    });

    it('should return updated document from service', async () => {
      const response = await serviceProvider.updateDocument(
        docId,
        updatedContent,
        objectId,
      );

      expect(response).toEqual(validPutResponse);
    });

    it('should return null if document does not exist', async () => {
      const response = await serviceProvider.updateDocument(
        'does-not-exist',
        updatedContent,
        objectId,
      );

      expect(response).toEqual(null);
    });
  });

  describe('createDocument', () => {
    beforeAll(() => {
      fetchMock.post({
        matcher: `begin:${providerUrl}`,
        response: (url: string) => {
          if (url === `${providerUrl}/document`) {
            return validGetResponse;
          }

          return 500;
        },
      });
    });

    it('should return new document from service', async () => {
      const response = await serviceProvider.createDocument(
        validContent,
        objectId,
      );

      expect(response).toEqual(validGetResponse);
    });

    it('should return null if something went wrong', async () => {
      const response = await serviceProvider.createDocument(null, objectId);

      expect(response).toEqual(null);
    });
  });
});
