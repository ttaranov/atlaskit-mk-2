import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import * as fetchMock from 'fetch-mock';
import { Client, ClientOptions } from '../..';
import { RemoteResourceAuthConfig } from '../../createObjectResolverServiceObservable';
import { ObjectState } from '../../types';

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

function resolved() {
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

function forbidden() {
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

function unauthorized() {
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

function restricted() {
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

function errored() {
  fetchMock.mock({
    name: 'errored',
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 500,
      throws: 'Errored mock',
    },
  });
}

function notfound() {
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

function delayP(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Client', () => {
  afterEach(() => fetchMock.restore());

  it('should call update function two times', async () => {
    forbidden();

    const result = await new Promise(resolve => {
      const stack: ObjectState[] = [];

      function cb(s: ObjectState) {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      }

      createClient()
        .register(OBJECT_URL, cb)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', definitionId: definitionId },
    ]);
  });

  it('should invoke different callbacks for the same URL', async () => {
    forbidden();

    const result = await new Promise(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn1 = (s: ObjectState) => {
        stack.push(s);
      };
      const cardUpdateFn2 = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 4) {
          return resolve(stack);
        }
      };

      createClient()
        .register(OBJECT_URL, cardUpdateFn1)
        .register(OBJECT_URL, cardUpdateFn2)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolving' },
      { status: 'resolved', definitionId },
      { status: 'resolved', definitionId },
    ]);
  });

  it('should be not-found when the object cannot be found', async () => {
    notfound();

    const result = await new Promise(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };
      createClient()
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'not-found', definitionId: undefined },
    ]);
  });

  it('should be unauthorized when the object cannot be accessed by the current user', async () => {
    unauthorized();

    const result = await new Promise<ObjectState[]>(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };
      createClient()
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result[1].status).toEqual('unauthorized');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be forbidden when the object cannot be accessed by the current user', async () => {
    restricted();

    const result = await new Promise<ObjectState[]>(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };
      createClient()
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result[1].status).toEqual('forbidden');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be errored when the object cannot be retrieved', async () => {
    errored();

    const result = await new Promise<ObjectState[]>(resolve => {
      let stack: ObjectState[] = [];
      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };
      createClient()
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result[1].status).toEqual('errored');
    expect(result[1].services).toEqual([]);
    expect(result[1].data).toBeUndefined();
  });

  it('should send proper sequense of states when reload with the same definitionId', async () => {
    resolved();

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
      client.register(OBJECT_URL, cardUpdateFn).get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', definitionId },
      { status: 'resolving' },
      { status: 'resolved', definitionId },
    ]);
  });

  it('should be resolved from the provider when a resolver is provided and the resolver resolves first', async () => {
    resolved();
    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const stack: ObjectState[] = [];

      const TEMPORARY_resolver = () => Promise.resolve(tempResData);

      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should switch to default resolver if the temp one failed', async () => {
    resolved();

    const result = await new Promise<ObjectState[]>(resolve => {
      const stack: ObjectState[] = [];

      const TEMPORARY_resolver = () =>
        Promise.reject({ error: new Error('failed for some reason') });

      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: { name: 'My Page' } },
    ]);
  });

  it('should be resolved from the temp provider when the default resolver errored', async () => {
    errored();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const stack: ObjectState[] = [];

      const TEMPORARY_resolver = () => Promise.resolve(tempResData);

      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should be resolved from the temp provider when the default provider resulted in "not found"', async () => {
    notfound();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const stack: ObjectState[] = [];

      const TEMPORARY_resolver = () => Promise.resolve(tempResData);

      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: tempResData },
    ]);
  });

  it('should be resolved from the temp provider when the default provider resulted in "not found"', async () => {
    resolved();

    const tempResData = { name: 'From resolver' };

    const result = await new Promise<ObjectState[]>(resolve => {
      const stack: ObjectState[] = [];

      const TEMPORARY_resolver = () =>
        new Promise(resolve => setTimeout(resolve, 1000, tempResData));

      const cardUpdateFn = (s: ObjectState) => {
        stack.push(s);
        if (stack.length === 2) {
          resolve(stack);
        }
      };

      createClient({ TEMPORARY_resolver })
        .register(OBJECT_URL, cardUpdateFn)
        .get(OBJECT_URL);
    });

    expect(result).toMatchObject([
      { status: 'resolving' },
      { status: 'resolved', data: { name: 'My Page' } },
    ]);
  });

  it('should not call a deregistered callback', async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    const client = createClient();

    client.register(OBJECT_URL, fn1);
    client.register(OBJECT_URL, fn2);
    client.register(OBJECT_URL, fn3);
    client.get(OBJECT_URL);

    await delayP(200);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);

    client.deregister(OBJECT_URL, fn2);

    client.get(OBJECT_URL);

    await delayP(200);

    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(2);
  });
});
