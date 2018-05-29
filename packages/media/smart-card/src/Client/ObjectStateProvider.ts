import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import {
  switchMap,
  map,
  catchError,
  startWith,
  refCount,
  publishReplay,
} from 'rxjs/operators';
import { fetch } from './fetch';

interface ResolveResponse {
  meta: {
    visibility: 'public' | 'restricted' | 'other';
    access: 'granted' | 'unauthorised' | 'forbidden';
  };
  data?: {
    [name: string]: any;
  };
}

export type ObjectStatus =
  | 'resolving'
  | 'resolved'
  | 'unauthorised'
  | 'forbidden'
  | 'not-found'
  | 'errored';

export interface ObjectState {
  status: ObjectStatus;
  data?: { [name: string]: any };
}

export class ObjectStateProviderOptions {
  serviceUrl: string;
  objectUrl: string;
}

export class ObjectStateProvider {
  private _subject: Subject<string>;
  private _observable: Observable<ObjectState>;

  constructor(options: ObjectStateProviderOptions) {
    const { serviceUrl, objectUrl } = options;

    /*

      This observable sends a request for each string observed on the subject. In-progress requests are cancelled.
      The responses are mapped to the object state
     */
    this._subject = new Subject();
    this._observable = this._subject.pipe(
      startWith('init'),
      switchMap(() =>
        fetch<ResolveResponse>('post', `${serviceUrl}/resolve`, {
          resourceUrl: encodeURI(objectUrl),
        }).pipe(
          map<ResolveResponse, ObjectState>(json => {
            if (json === undefined) {
              return { status: 'not-found' };
            }
            switch (json.meta.access) {
              case 'forbidden':
                return { status: 'forbidden', data: json.data };

              case 'unauthorised':
                return { status: 'unauthorised', data: json.data };

              default:
                return { status: 'resolved', data: json.data };
            }
          }),
          startWith<ObjectState>({ status: 'resolving' }),
        ),
      ),
      catchError(() => of<ObjectState>({ status: 'errored' })),
      publishReplay(1),
      refCount(),
    );
  }

  observable(): Observable<ObjectState> {
    return this._observable;
  }

  refresh() {
    this._subject.next('refresh');
  }
}
