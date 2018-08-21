import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import * as fetchMock from 'fetch-mock';
import { Client, ClientOptions } from '../..';
import { RemoteResourceAuthConfig } from '../../createObjectResolverServiceObservable';
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

function errored() {
  fetchMock.mock({
    matcher: `begin:${RESOLVE_URL}`,
    response: {
      status: 500,
      throws: 'Error',
    },
  });
}

function notfound() {
  fetchMock.mock({
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

describe('Client', () => {
  afterEach(() => fetchMock.restore());

  it('should be resolving when the object is being retrieved', async () => {
    resolved();

    const state = await createClient()
      .get(OBJECT_URL)
      .take(1)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolving');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be not-found when the object cannot be found', async () => {
    notfound();

    const state = await createClient()
      .get(OBJECT_URL)
      .take(2)
      .takeLast(1)
      .toPromise();

    expect(state.status).toEqual('not-found');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be resolved when the object has been retrieved', async () => {
    resolved();

    const state = await createClient()
      .get(OBJECT_URL)
      .take(2)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual({
      '@context': {},
      generator,
      name,
    });
  });

  it('should be unauthorised when the object cannot be accessed by the current user', async () => {
    fetchMock.mock({
      matcher: `begin:${RESOLVE_URL}`,
      response: {
        status: 200,
        body: JSON.stringify({
          meta: {
            visibility: 'restricted',
            access: 'unauthorised',
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

    const state = await createClient()
      .get(OBJECT_URL)
      .take(2)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('unauthorised');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be forbidden when the object cannot be accessed by the current user', async () => {
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

    const state = await createClient()
      .get(OBJECT_URL)
      .take(2)
      .takeLast(1)
      .toPromise();

    expect(state.status).toEqual('forbidden');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be errored when the object cannot be retrieved', async () => {
    errored();

    const state = await createClient()
      .get(OBJECT_URL)
      .take(2)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('errored');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should reload when reload is called for the same provider', done => {
    expect.assertions(4);
    resolved();
    resolved();
    let count = 0;
    const client = createClient();
    const subscription = client.get(OBJECT_URL).subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');

          client.reload(definitionId);

          break;

        case 2:
          expect(status).toEqual('resolving');
          break;

        case 3:
          expect(status).toEqual('resolved');

          setTimeout(() => {
            // allow other requests to happen (and fail the test)
            subscription.unsubscribe();
            done();
          }, 150);

          break;

        default:
          done.fail();
      }
    });
  });

  it('should not reload when reload is called for a different provider', done => {
    expect.assertions(2);
    resolved();
    resolved();
    let count = 0;
    const client = createClient();
    const subscription = client.get(OBJECT_URL).subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');

          client.reload('def-456');

          setTimeout(() => {
            // allow other requests to happen (and fail the test)
            subscription.unsubscribe();
            done();
          }, 150);

          break;

        default:
          done.fail();
      }
    });
  });

  it('should immediately replay the most recent state to additional subscribers', done => {
    expect.assertions(1);
    resolved();
    const client = createClient();
    const subscription = client
      .get(OBJECT_URL)
      .subscribe(async stateFromFirstObserver => {
        if (stateFromFirstObserver.status === 'resolved') {
          const stateFromSecondObserver = await client
            .get(OBJECT_URL)
            .take(1)
            .takeLast(1)
            .toPromise();
          expect(stateFromSecondObserver).toEqual(stateFromFirstObserver);
          subscription.unsubscribe();
          done();
        }
      });
  });

  it('should be resolved from the provider when a resolver is provided and the resolver resolves first', async () => {
    resolved();
    const state = await createClient({
      TEMPORARY_resolver: async () => ({ name: 'From resolver' }),
    })
      .get(OBJECT_URL)
      .take(3)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual(
      expect.objectContaining({
        name: 'From resolver',
      }),
    );
  });

  it('should be resolved from the provider when a resolver is provided and the ORS errored', async () => {
    errored();
    const state = await createClient({
      TEMPORARY_resolver: async () => ({ name: 'From resolver' }),
    })
      .get(OBJECT_URL)
      .take(3)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual(
      expect.objectContaining({
        name: 'From resolver',
      }),
    );
  });

  it('should be resolved from the provider when a resolver is provided and the ORS was not-found', async () => {
    notfound();
    const state = await createClient({
      TEMPORARY_resolver: async () => ({ name: 'From resolver' }),
    })
      .get(OBJECT_URL)
      .take(3)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual(
      expect.objectContaining({
        name: 'From resolver',
      }),
    );
  });

  it('should be resolved from the ORS when a resolver is provided and the resolver does not resolve first', async () => {
    resolved();
    const resolver = () =>
      new Promise(resolve =>
        setTimeout(() => resolve({ name: 'From resolver' }), 100),
      );
    const state = await createClient({ TEMPORARY_resolver: resolver })
      .get(OBJECT_URL)
      .take(3)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual(
      expect.objectContaining({
        name: 'My Page',
      }),
    );
  });

  it('should be resolved from the ORS when a resolver is provided and the resolver is errored', async () => {
    resolved();
    const resolver = () => Promise.reject(new Error('😵'));
    const state = await createClient({ TEMPORARY_resolver: resolver })
      .get(OBJECT_URL)
      .take(3)
      .takeLast(1)
      .toPromise();
    expect(state.status).toEqual('resolved');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual(
      expect.objectContaining({
        name: 'My Page',
      }),
    );
  });
});
