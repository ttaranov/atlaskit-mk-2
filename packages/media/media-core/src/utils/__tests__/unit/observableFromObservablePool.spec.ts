import { Pool } from '../../../providers/util/pool';
import { observableFromObservablePool } from '../../../providers/util/observableFromObservablePool';
import { Observable } from 'rxjs/Observable';

describe('observableFromObservablePool()', () => {
  it('acquires the actual resource on subscription', () => {
    const pool = new Pool<Observable<number>>();
    const createFn = jest.fn(() => Observable.create(0));
    const observable = observableFromObservablePool(pool, 'item', createFn);
    expect(createFn).not.toHaveBeenCalled();

    observable.subscribe();
    expect(createFn).toHaveBeenCalledTimes(1);
  });

  it('releases the actual resource when unsubscribed', () => {
    const pool = new Pool<Observable<number>>();
    const createFn = jest.fn(
      () =>
        new Observable(subscriber => {
          subscriber.next(0);
        }),
    );
    const observable = observableFromObservablePool(pool, 'item', createFn);

    jest.spyOn(pool, 'release');

    expect(pool.release).not.toHaveBeenCalled();

    const subscription = observable.subscribe();
    subscription.unsubscribe();

    expect(pool.release).toHaveBeenCalledTimes(1);
  });

  it('wires up the observables correctly', () => {
    const pool = new Pool<Observable<number>>();
    const createFn = jest.fn(
      () =>
        new Observable(subscriber => {
          subscriber.next(0);
        }),
    );
    const observable = observableFromObservablePool(pool, 'item', createFn);

    return new Promise(resolve => {
      observable.subscribe({
        next() {
          resolve();
        },
      });
    });
  });
});
