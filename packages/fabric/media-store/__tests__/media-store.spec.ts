import { MediaStore } from '../src/';

describe('MediaStore', () => {
  const setup = (fetchResponse = Promise.resolve({ json: jest.fn() })) => {
    const auth = { clientId: 'some-client-id', token: 'some-token' };
    const mediaStore = new MediaStore({
      apiUrl: 'some-api-url',
      authProvider: () => Promise.resolve(auth),
    });

    mediaStore['fetch'] = jest.fn().mockReturnValueOnce(fetchResponse);

    return {
      mediaStore,
      fetch: mediaStore['fetch'],
    };
  };

  describe('createUpload', () => {
    it('should fetch from /upload api', () => {
      const createUpTo = randomInteger();
      const { mediaStore, fetch } = setup();

      return mediaStore.createUpload(createUpTo).then(() => {
        expect(fetch).toBeCalledWith(`/upload?createUpTo=${createUpTo}`, {
          method: 'POST',
        });
      });
    });
  });
});

function randomInteger(max: number = 100): number {
  return Math.floor(Math.random() * max);
}
