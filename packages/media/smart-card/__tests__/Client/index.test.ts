import { Subject, Observable } from 'rxjs';
import mock, { once } from 'xhr-mock';
import { Client } from '../../src/Client';

const RESOLVE_URL =
  'https://api-private.stg.atlassian.com/object-resolver/resolve';
const OBJECT_URL = 'http://example.com/foobar';

const auth = [];

const definitionId = 'abc-123';

const generator = {
  name: 'My App',
};

const name = 'My Page';

function createClient() {
  return new Client();
}

const nth = (n: number) => <T>(source: Observable<T>) =>
  new Observable<T>(observer => {
    let count = 0;
    return source.subscribe({
      next(value) {
        if (count++ === n) {
          observer.next(value);
          observer.complete();
        }
      },
      error(error) {
        observer.error(error);
      },
      complete() {
        observer.complete();
      },
    });
  });

function resolved() {
  mock.post(
    RESOLVE_URL,
    once({
      status: 200,
      body: JSON.stringify({
        meta: {
          visibility: 'restricted',
          access: 'granted',
          auth,
          definitionId,
        },
        data: {
          '@context': {},
          generator,
          name,
        },
      }),
    }),
  );
}

describe('Client', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should be resolving when the object is being retrieved', async () => {
    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(0))
      .toPromise();
    expect(state.status).toEqual('resolving');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be not-found when the object cannot be found', async () => {
    mock.post(
      RESOLVE_URL,
      once({
        status: 200,
        body: JSON.stringify({
          meta: {
            visibility: 'not_found',
            access: 'granted',
            auth,
            definitionId,
          },
        }),
      }),
    );

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('not-found');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be resolved when the object has been retrieved', async () => {
    resolved();

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
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
    mock.post(
      RESOLVE_URL,
      once({
        status: 200,
        body: JSON.stringify({
          meta: {
            visibility: 'restricted',
            access: 'unauthorised',
            auth,
            definitionId,
          },
          data: {
            '@context': {},
            generator,
          },
        }),
      }),
    );

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('unauthorised');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be forbidden when the object cannot be accessed by the current user', async () => {
    mock.post(
      RESOLVE_URL,
      once({
        status: 200,
        body: JSON.stringify({
          meta: {
            visibility: 'restricted',
            access: 'forbidden',
            auth,
            definitionId,
          },
          data: {
            '@context': {},
            generator,
          },
        }),
      }),
    );

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('forbidden');
    expect(state.services).toEqual([]);
    expect(state.data).toEqual({
      '@context': {},
      generator,
    });
  });

  it('should be errored when the object cannot be retrieved', async () => {
    mock.post(RESOLVE_URL, {
      status: 500,
    });

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('errored');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be errored when an error is thrown', async () => {
    mock.error(() => {
      /* silence error logging */
    });
    mock.post('http://object-resolver-service/resolve', () =>
      Promise.reject(new Error('Uh oh')),
    );

    const state = await createClient()
      .get(OBJECT_URL)
      .pipe(nth(1))
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
            .pipe(nth(0))
            .toPromise();
          expect(stateFromSecondObserver).toEqual(stateFromFirstObserver);
          subscription.unsubscribe();
          done();
        }
      });
  });
});
