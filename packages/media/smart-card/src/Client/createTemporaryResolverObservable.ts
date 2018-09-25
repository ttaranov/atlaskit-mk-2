import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { concat } from 'rxjs/operators/concat';
import { of } from 'rxjs/observable/of';
import { ObjectState, TemporaryResolver } from './types';

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
