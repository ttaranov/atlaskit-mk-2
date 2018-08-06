jest.mock('../mediaClient');

import { AuthProvider } from '@atlaskit/media-core';
import { MediaClientPool } from '../mediaClientPool';
import { MediaClient } from '../mediaClient';

describe('MediaClientPool', () => {
  const baseUrl = 'some-base-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const firstCollection = 'first-collection';
  const secondCollection = 'second-collection';

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setup = () => {
    const authProvider: AuthProvider = () =>
      Promise.resolve({ clientId, token, baseUrl });
    const mediaClientPool = new MediaClientPool(authProvider);
    return { authProvider, mediaClientPool };
  };

  it('should create a new client for the first time', () => {
    const { mediaClientPool } = setup();

    mediaClientPool.getMediaClient(firstCollection);

    expect(MediaClient).toHaveBeenCalledTimes(1);
  });

  it('should return the stored client for the same collection second time', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient(firstCollection);
    const client2 = mediaClientPool.getMediaClient(firstCollection);

    expect(MediaClient).toHaveBeenCalledTimes(1);
    expect(client1).toBe(client2);
  });

  it('should create a new client for different collection', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient(firstCollection);
    const client2 = mediaClientPool.getMediaClient(secondCollection);

    expect(MediaClient).toHaveBeenCalledTimes(2);
    expect(client1).not.toBe(client2);
  });

  it('should create and return the stored client for the undefined value as a collection name', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient();
    const client2 = mediaClientPool.getMediaClient();

    expect(MediaClient).toHaveBeenCalledTimes(1);
    expect(client1).toBe(client2);
  });

  it('should create and return the stored client for the empty string as a collection name', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient('');
    const client2 = mediaClientPool.getMediaClient('');

    expect(MediaClient).toHaveBeenCalledTimes(1);
    expect(client1).toBe(client2);
  });

  it('should provide different clients for undefined, null, empty and non-empty collection names', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient('');
    const client2 = mediaClientPool.getMediaClient();
    const client4 = mediaClientPool.getMediaClient(firstCollection);
    const client5 = mediaClientPool.getMediaClient('');
    const client6 = mediaClientPool.getMediaClient();
    const client8 = mediaClientPool.getMediaClient(firstCollection);

    expect(MediaClient).toHaveBeenCalledTimes(3);
    expect(client5).toBe(client1);
    expect(client6).toBe(client2);
    expect(client8).toBe(client4);
  });

  it('should provide different client for an undefined collection and collection named "undefined"', () => {
    const { mediaClientPool } = setup();

    const client1 = mediaClientPool.getMediaClient();
    const client2 = mediaClientPool.getMediaClient('undefined');

    expect(MediaClient).toHaveBeenCalledTimes(2);
    expect(client1).not.toBe(client2);
  });

  it('should pass collection name to the media client constructor if the collection is defined', () => {
    const { authProvider, mediaClientPool } = setup();

    mediaClientPool.getMediaClient(firstCollection);

    expect(MediaClient).toHaveBeenCalledTimes(1);
    expect(MediaClient).toBeCalledWith(authProvider, firstCollection);
  });

  it('should pass undefined as collection name to the media client constructor if the collection was not provided', () => {
    const { authProvider, mediaClientPool } = setup();

    mediaClientPool.getMediaClient();

    expect(MediaClient).toHaveBeenCalledTimes(1);
    expect(MediaClient).toBeCalledWith(authProvider, undefined);
  });
});
