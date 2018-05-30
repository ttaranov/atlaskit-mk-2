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
    auth: {
      key: string;
      displayName: string;
      url: string;
    }[];
    definitionId: string;
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

export interface ObjectService {
  id: string;
  name: string;
  startAuthUrl: string;
}

export interface ObjectState {
  status: ObjectStatus;
  services: ObjectService[];
  data?: { [name: string]: any };
}

function convertAuthToService(auth: {
  key: string;
  displayName: string;
  url: string;
}): ObjectService {
  return {
    id: auth.key,
    name: auth.displayName,
    startAuthUrl: auth.url,
  };
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
              return {
                status: 'not-found',
                services: [],
              };
            }
            switch (json.meta.access) {
              case 'forbidden':
                return {
                  status: 'forbidden',
                  services: json.meta.auth.map(convertAuthToService),
                  data: json.data,
                };

              case 'unauthorised':
                return {
                  status: 'unauthorised',
                  services: json.meta.auth.map(convertAuthToService),
                  data: json.data,
                };

              default:
                return {
                  status: 'resolved',
                  services: json.meta.auth.map(convertAuthToService),
                  data: json.data,
                };
            }
          }),
          startWith<ObjectState>({
            status: 'resolving',
            services: [],
          }),
        ),
      ),
      catchError(() =>
        of<ObjectState>({
          status: 'errored',
          services: [],
        }),
      ),
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
