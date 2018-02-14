import 'whatwg-fetch';
import fetchMock = require('fetch-mock');

import { defaultServiceHost } from '@atlaskit/media-test-helpers';

import { MediaStore } from '../src/';

describe('MediaStore', () => {
  const apiUrl = defaultServiceHost;
  const clientId = 'some-client-id';
  const token = 'some-token';
  const auth = { clientId, token };
  const authProvider = () => Promise.resolve(auth);

  describe('createUpload', () => {
    const setup = () => {
      const fetch = fetchMock.mock(`*`, {
        body: { hello: 'world' },
        status: 201,
      });

      const mediaStore = new MediaStore({
        apiUrl,
        authProvider,
      });

      return {
        fetch,
        mediaStore,
      };
    };

    afterEach(() => fetchMock.restore());

    it('should fetch from /upload endpoint with correct parameters', () => {
      const createUpTo = randomInteger();
      const { mediaStore, fetch } = setup();

      return mediaStore.createUpload(createUpTo).then(response => {
        expect(fetch.lastUrl()).toEqual(
          `${apiUrl}/upload?createUpTo=${createUpTo}`,
        );
      });
    });
  });
});

function randomInteger(max: number = 100): number {
  return Math.floor(Math.random() * max);
}
