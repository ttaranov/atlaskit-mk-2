import { Observable } from 'rxjs/Observable';
import { ObjectState } from './types';

// this is very hacky bur used because rxjs' race() won't work with never ending observables and intermediate values
export function race(
  a: Observable<ObjectState>,
  b: Observable<ObjectState>,
): Observable<ObjectState> {
  return Observable.create(observer => {
    let winner: 'a' | 'b' | undefined = undefined;
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
        state.status === 'unauthorised' ||
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
        state.status === 'unauthorised' ||
        state.status === 'forbidden'
      ) {
        winner = 'b';
      }
      console.log('state', state);
      observer.next(state);
    });

    return () => {
      subscriptionA.unsubscribe();
      subscriptionB.unsubscribe();
    };
  });
}
