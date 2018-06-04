import { Subject, Observable } from 'rxjs';
import mock, { once } from 'xhr-mock';
import { Command } from '../../src/Client/Command';
import { ObjectStateProvider } from '../../src/Client/ObjectStateProvider';

const RESOLVE_URL = 'http://object-resolver-service/resolve';

const auth = [];

const definitionId = 'abc-123';

const generator = {
  name: 'My App',
};

const name = 'My Page';

function createProvider($reload?: Subject<Command>) {
  return new ObjectStateProvider({
    serviceUrl: 'http://object-resolver-service',
    objectUrl: 'https://example.com/foobar',
    $reload: $reload || new Subject(),
  });
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

describe('ObjectStateProvider', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should be resolving when the object is being retrieved', async () => {
    const state = await createProvider()
      .observable()
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

    const state = await createProvider()
      .observable()
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('not-found');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should be resolved when the object has been retrieved', async () => {
    resolved();

    const state = await createProvider()
      .observable()
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

    const state = await createProvider()
      .observable()
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

    const state = await createProvider()
      .observable()
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
    mock.post('http://object-resolver-service/resolve', {
      status: 500,
    });

    const state = await createProvider()
      .observable()
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

    const state = await createProvider()
      .observable()
      .pipe(nth(1))
      .toPromise();
    expect(state.status).toEqual('errored');
    expect(state.services).toEqual([]);
    expect(state.data).toBeUndefined();
  });

  it('should reload when the triggered for the same url but no provider', done => {
    expect.assertions(4);
    resolved();
    resolved();
    let count = 0;
    const $reload = new Subject<Command>();
    const provider = createProvider($reload);
    const observable = provider.observable();
    const subscription = observable.subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');
          $reload.next({
            type: 'reload',
            url: 'https://example.com/foobar',
          });
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

  it('should not reload when triggered for a different url but no provider', done => {
    expect.assertions(2);
    resolved();
    resolved();
    let count = 0;
    const $reload = new Subject<Command>();
    const provider = createProvider($reload);
    const observable = provider.observable();
    const subscription = observable.subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');
          $reload.next({
            type: 'reload',
            url: 'https://example.com/barfoo',
          });
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

  it('should reload when triggered for a different url but the same provider', done => {
    expect.assertions(4);
    resolved();
    resolved();
    let count = 0;
    const $reload = new Subject<Command>();
    const provider = createProvider($reload);
    const observable = provider.observable();
    const subscription = observable.subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');
          $reload.next({
            type: 'reload',
            url: 'https://example.com/foobar',
            provider: 'def-456',
          });
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

  it('should not reload when triggered for a different url and a different provider', done => {
    expect.assertions(2);
    resolved();
    resolved();
    let count = 0;
    const $reload = new Subject<Command>();
    const provider = createProvider($reload);
    const observable = provider.observable();
    const subscription = observable.subscribe(({ status }) => {
      switch (count++) {
        case 0:
          expect(status).toEqual('resolving');
          break;

        case 1:
          expect(status).toEqual('resolved');
          $reload.next({
            type: 'reload',
            url: 'https://example.com/barfoo',
            provider: 'def-456',
          });
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
    const observable = createProvider().observable();
    const subscription = observable.subscribe(async stateFromFirstObserver => {
      if (stateFromFirstObserver.status === 'resolved') {
        const stateFromSecondObserver = await observable
          .pipe(nth(0))
          .toPromise();
        expect(stateFromSecondObserver).toEqual(stateFromFirstObserver);
        subscription.unsubscribe();
        done();
      }
    });
  });
});
