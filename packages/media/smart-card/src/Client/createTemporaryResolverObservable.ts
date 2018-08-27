import { Observable } from 'rxjs/Observable';
import { ObjectState, TemporaryResolver } from './types';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map, mergeMap, concat } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

export function createTemporaryResolverObservable(
  url: string,
  resolver: TemporaryResolver,
): Observable<ObjectState> {
  return of(null).pipe(
    mergeMap(() =>
      of<ObjectState>({
        status: 'resolving',
        services: [],
      }).pipe(
        concat(
          fromPromise<any>(resolver(url)).pipe(
            map<any, ObjectState>(data => {
              if (data) {
                return {
                  status: 'resolved',
                  services: [],
                  data,
                };
              } else {
                return {
                  status: 'not-found',
                  services: [],
                  data,
                };
              }
            }),
            catchError(() =>
              of<ObjectState>({
                status: 'errored',
                services: [],
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
