import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import * as fetchMock from 'fetch-mock';
import { Client, ClientOptions } from '../..';
import { RemoteResourceAuthConfig } from '../../createObjectResolverServiceObservable';
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

const name = 'My Page';

function createClient(options?: ClientOptions) {
  return new Client(options);
}

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
          generator,
          name,
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
          name,
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
      createClient()
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

      createClient()
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
      createClient()
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
      createClient()
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
      createClient()
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
      createClient()
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
      const client = createClient();
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

  it('should be resolved from the provider when a resolver is provided and the resolver resolves first', async () => {
    mockResolvedFetchCall();
    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const TEMPORARY_resolver = () => Promise.resolve(tempResData);

      const mockCardUpdateFunction = onNthState(resolve, 2);

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should switch to default resolver if the temp one failed', async () => {
    mockResolvedFetchCall();

    const result = await new Promise<ObjectState[]>(resolve => {
      const TEMPORARY_resolver = () =>
        Promise.reject({ error: new Error('failed for some reason') });

      const mockCardUpdateFunction = onNthState(resolve, 2);

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: { name: 'My Page' } },
    ]);
  });

  it('should be resolved from the temp provider when the default resolver errored', async () => {
    mockErroredFetchCall();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const TEMPORARY_resolver = () => Promise.resolve(tempResData);
      const mockCardUpdateFunction = onNthState(resolve, 2);
      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should be resolved from the temp provider when the default provider resulted in "not found"', async () => {
    mockNotFoundFetchCall();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const TEMPORARY_resolver = () => Promise.resolve(tempResData);
      const mockCardUpdateFunction = onNthState(resolve, 2);

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should be resolved from the temp provider when the default provider resulted in "not found"', async () => {
    mockResolvedFetchCall();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const TEMPORARY_resolver = () =>
        new Promise(resolve => setTimeout(resolve, 1000, tempResData));

      const mockCardUpdateFunction = onNthState(resolve, 2);

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, v4(), mockCardUpdateFunction)
        .resolve(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: { name: 'My Page' } },
    ]);
  });
});
