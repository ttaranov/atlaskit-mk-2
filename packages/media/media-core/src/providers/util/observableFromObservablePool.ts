import { Observable } from 'rxjs/Observable';
import { Pool } from './pool';
import { FileState } from '../../fileState';

export function observableFromObservablePool<Result>(
  pool: Pool<Observable<Result>>,
  poolId: string,
  createObservable: () => Observable<Result>,
): Observable<Result> {
  return new Observable(subscriber => {
    const observable = pool.acquire(poolId, createObservable);
    const subscription = observable.subscribe(subscriber);
    return () => {
      subscription.unsubscribe();
      pool.release(poolId);
    };
  });
}

export function deferUnsubscribeAfterUpload(
  observable: Observable<FileState>,
): Observable<FileState> {
  return new Observable<FileState>(subscriber => {
    const subscription = observable.subscribe(subscriber);
    const p = new Promise<{}>((resolve, reject) => {
      const fancySub = observable.subscribe({
        next(state) {
          if (state.status !== 'uploading') {
            resolve();
            fancySub.unsubscribe();
          }
        },
        complete() {
          resolve();
          fancySub.unsubscribe();
        },
        error() {
          reject(null);
          fancySub.unsubscribe();
        },
      });
    });

    return () => {
      // only unsubscribe IF is done uploading / or error or complete
      p.then(() => {
        subscription.unsubscribe();
      });
    };
  });
}
