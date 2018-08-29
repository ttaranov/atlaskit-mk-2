import { Observable } from 'rxjs/Observable';
import { ObjectState } from './types';
import { Subscriber } from 'rxjs/Subscriber';

// this is very hacky but used because rxjs' race() won't work with never ending observables and intermediate values
export function race(
  a: Observable<ObjectState>,
  b: Observable<ObjectState>,
): Observable<ObjectState> {
  return Observable.create((observer: Subscriber<ObjectState>) => {
    let winner: 'a' | 'b' | undefined;
    let errorCount = 0;

    const subscriptionA = a.subscribe(state => {
      if (winner === 'b') {
        return;
      }
      if (state.status === 'errored' || state.status === 'not-found') {
        ++errorCount;
        if (errorCount === 2) {
          observer.next(state);
        }
        return;
      } else if (
        state.status === 'resolved' ||
        state.status === 'unauthorized' ||
        state.status === 'forbidden'
      ) {
        winner = 'a';
      }
      observer.next(state);
    });

    const subscriptionB = b.subscribe(state => {
      if (winner === 'a') {
        return;
      }
      if (state.status === 'errored' || state.status === 'not-found') {
        ++errorCount;
        if (errorCount === 2) {
          observer.next(state);
        }
        return;
      } else if (
        state.status === 'resolved' ||
        state.status === 'unauthorized' ||
        state.status === 'forbidden'
      ) {
        winner = 'b';
      }
      observer.next(state);
    });

    return () => {
      subscriptionA.unsubscribe();
      subscriptionB.unsubscribe();
    };
  });
}
