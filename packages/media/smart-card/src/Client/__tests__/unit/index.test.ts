import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import * as fetchMock from 'fetch-mock';
import { Client, RemoteResourceAuthConfig, ResolveResponse } from '../..';
import { ObjectState } from '../../types';
import { v4 } from 'uuid';

const RESOLVE_URL =
  'https://api-private.stg.atlassian.com/object-resolver/resolve';

const OBJECT_URL = 'http://example.com/foobar';

const remoteResourceMetaAuth: RemoteResourceAuthConfig[] = [];

const definitionId = 'abc-123';

const generator = {
  name: 'My App',
};

function mockResolvedFetchCall() {
  fetchMock.mock({
    name: 'resolved',
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'restricted',
          access: 'granted',
          auth: remoteResourceMetaAuth,
          definitionId,
        },
        data: {
          '@context': {},
          name: 'My Page',
          generator,
        },
      }),
    },
  });
}

function mockForbiddenFetchCall() {
  fetchMock.mock({
    name: 'forbidden',
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'restricted',
          access: 'granted',
          auth: remoteResourceMetaAuth,
          definitionId,
        },
        data: {
          '@context': {},
          generator,
          name: 'My Page',
        },
      }),
    },
  });
}

function mockUnauthorizedFetchCall() {
  fetchMock.mock({
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'restricted',
          access: 'unauthorized',
          auth: remoteResourceMetaAuth,
          definitionId,
        },
        data: {
          '@context': {},
          generator,
        },
      }),
    },
  });
}

function mockRestrictedFetchCall() {
  fetchMock.mock({
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'restricted',
          access: 'forbidden',
          auth: remoteResourceMetaAuth,
          definitionId,
        },
        data: {
          '@context': {},
          generator,
        },
      }),
    },
  });
}

function mockErroredFetchCall() {
  fetchMock.mock({
    name: 'errored',
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 500,
      throws: 'Errored mock',
    },
  });
}

function mockNotFoundFetchCall() {
  fetchMock.mock({
    name: 'notfound',
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'not_found',
          access: 'granted',
          auth: remoteResourceMetaAuth,
          definitionId,
        },
      }),
    },
  });
}

function onNthState(cb: (x: any) => any, n: number): (s: ObjectState) => void {
  let stack: ObjectState[] = [];
  return (s: ObjectState) => {
    stack.push(s);
    if (stack.length === n) {
      cb(stack);
    }
  };
}

describe('Client', () => {
  afterEach(() => fetchMock.restore());

  it('should call update function two times', async () => {
    mockForbiddenFetchCall();

    const result = await new Promise(resolve => {
      const mockCardUpdateFunction = onNthState(resolve, 2);
      new Client()
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', definitionId: definitionId },
    ]);
  });

  it('should invoke different callbacks for the same URL', async () => {
    mockForbiddenFetchCall();

    const result = await new Promise(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn1 = (cardState: ObjectState) => {
        stack.push(cardState);
      };
      const cardUpdateFn2 = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 4) {
          return resolve(stack);
        }
      };

      new Client()
        .register(OBJECT_URL, v4(), cardUpdateFn1)
        .register(OBJECT_URL, v4(), cardUpdateFn2)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolving' },
      { status: 'resolved', definitionId },
      { status: 'resolved', definitionId },
    ]);
  });

  it('should be not-found when the object cannot be found', async () => {
    mockNotFoundFetchCall();

    const result = await new Promise(resolve => {
      const mockCardUpdateFunction = onNthState(resolve, 2);
      new Client()
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'not-found', definitionId: undefined },
    ]);
  });

  it('should be unauthorized when the object cannot be accessed by the current user', async () => {
    mockUnauthorizedFetchCall();

    const result = await new Promise<ObjectState[]>(resolve => {
      const mockCardUpdateFunction = onNthState(resolve, 2);
      new Client()
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result[1].status).toEqual('unauthorized');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be forbidden when the object cannot be accessed by the current user', async () => {
    mockRestrictedFetchCall();

    const result = await new Promise<ObjectState[]>(resolve => {
      const mockCardUpdateFunction = onNthState(resolve, 2);
      new Client()
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result[1].status).toEqual('forbidden');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be errored when the object cannot be retrieved', async () => {
    mockErroredFetchCall();

    const result = await new Promise<ObjectState[]>(resolve => {
      const mockCardUpdateFunction = onNthState(resolve, 2);
      new Client()
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result[1].status).toEqual('errored');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toBeUndefined();
  });

  it('should send proper sequense of states when reload with the same definitionId', async () => {
    mockResolvedFetchCall();

    const result = await new Promise<ObjectState[]>(resolve => {
      const client = new Client();
      const stack: ObjectState[] = [];
      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          client.reload(OBJECT_URL, definitionId);
        }
        if (stack.length === 4) {
          resolve(stack);
        }
      };
      client.register(OBJECT_URL, v4(), cardUpdateFn).resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', definitionId },
      { status: 'resolving' },
      { status: 'resolved', definitionId },
    ]);
  });

  it('should be possible to extend the functionality of the default client', async () => {
    mockResolvedFetchCall();

    const specialCaseUrl = 'http://some.jira.com/board/ISS-1234';

    const customResponse = {
      meta: {
        visibility: 'public',
        access: 'granted',
        auth: [],
        definitionId: 'custom-def',
      },
      data: {
        name: 'Doc 1',
      },
    } as ResolveResponse;

    const callHistory = await new Promise<ObjectState[]>(resolve => {
      class CustomClient extends Client {
        fetchData(url: string) {
          if (url === specialCaseUrl) {
            return Promise.resolve(customResponse);
          }
          return super.fetchData(url);
        }
      }
      const customClient = new CustomClient();
      const stack: ObjectState[] = [];

      const callbackForSpecialCase = (s: ObjectState) => {
        stack.push(s);
      };

      const callbackForNormalCase = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 4) {
          resolve(stack);
        }
      };

      customClient
        .register(specialCaseUrl, v4(), callbackForSpecialCase)
        .register(OBJECT_URL, v4(), callbackForNormalCase);

      customClient.resolve(OBJECT_URL);
      customClient.resolve(specialCaseUrl);
    });

    expect(callHistory).toMatchObject([
      { status: 'resolving' },
      { status: 'resolving' },
      {
        status: 'resolved',
        definitionId: 'custom-def',
        data: { name: 'Doc 1' },
      },
      { status: 'resolved', definitionId },
    ]);
  });

  it('should not reload card that has already been resolved', async () => {
    mockResolvedFetchCall();

    const card1 = {
      url: 'http://drive.google.com/doc/1',
      uuid: v4(),
      definitionId: undefined,
      updateFn: jest.fn().mockImplementation((state: ObjectState) => {
        if (state.definitionId) {
          card1.definitionId = state.definitionId as any;
        }
      }),
    };

    const card2 = {
      url: 'http://drive.google.com/doc/2',
      uuid: v4(),
      definitionId: undefined,
      updateFn: jest.fn().mockImplementation((state: ObjectState) => {
        if (state.definitionId) {
          card1.definitionId = state.definitionId as any;
        }
      }),
    };

    const customFetchMock = jest.fn().mockImplementation((url: string) => {
      if (url === card1.url) {
        return Promise.resolve(<ResolveResponse>{
          meta: {
            visibility: 'public',
            access: 'granted',
            auth: [],
            definitionId: 'google',
          },
          data: {
            name: 'Doc for Card 1',
          },
        });
      } else if (url === card2.url) {
        return Promise.resolve(<ResolveResponse>{
          meta: {
            visibility: 'public',
            access: 'granted',
            auth: [],
            definitionId: 'google',
          },
          data: {
            name: 'Doc for Card 2',
          },
        });
      }
    });

    class CustomClient extends Client {
      fetchData(url: string): Promise<ResolveResponse> {
        return customFetchMock(url);
      }
    }

    const client = new CustomClient();

    client.register(card1.url, card1.uuid, card1.updateFn);
    client.register(card2.url, card2.uuid, card2.updateFn);

    client.resolve(card1.url);
    client.resolve(card2.url);

    await new Promise(res => setTimeout(res, 1));

    expect(customFetchMock.mock.calls).toEqual([[card1.url], [card2.url]]);

    expect(card1.updateFn).toHaveBeenCalledTimes(2);
    expect(card2.updateFn).toHaveBeenCalledTimes(2);
  });
});
