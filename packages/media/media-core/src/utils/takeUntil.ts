import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';

export type Predicate<T> = (value: T) => boolean;

export function takeUntil<T>(
  predicate: Predicate<T>,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
      return source.subscribe({
        next: value => {
          subscriber.next(value);
          if (predicate(value)) {
            subscriber.complete();
          }
        },
        complete: () => subscriber.complete(),
        error: error => subscriber.error(error),
      });
    });
}
