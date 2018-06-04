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
import { Command } from './Command';
import { fetch } from './fetch';

// @see https://product-fabric.atlassian.net/wiki/spaces/CS/pages/279347271/Object+Provider
interface ResolveResponse {
  meta: {
    visibility: 'public' | 'restricted' | 'other' | 'not_found';
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
  | 'not-found'
  | 'resolved'
  | 'unauthorised'
  | 'forbidden'
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
  $reload: Subject<Command>;
}

export class ObjectStateProvider {
  private url: string;
  private provider: string;
  private readonly $reload: Subject<Command>;
  private readonly $observable: Observable<ObjectState>;

  constructor(options: ObjectStateProviderOptions) {
    const { serviceUrl, objectUrl, $reload } = options;

    this.url = objectUrl;

    /*
      This observable sends a request for each string observed on the subject. In-progress requests are cancelled.
      The responses are mapped to the object state
     */
    this.$reload = $reload;
    this.$observable = this.$reload.pipe(
      startWith({
        type: 'init',
      }),
      switchMap((cmd: Command) => {
        // ignore reloads for other providers
        if (cmd.type === 'reload') {
          const reloadThisUrl = cmd.url === this.url;
          const reloadForTheSameProvider =
            cmd.provider && cmd.provider === this.provider;
          if (!reloadThisUrl && !reloadForTheSameProvider) {
            return Observable.of();
          }
        }

        return fetch<ResolveResponse>('post', `${serviceUrl}/resolve`, {
          resourceUrl: encodeURI(objectUrl),
        }).pipe(
          map<ResolveResponse, ObjectState>(json => {
            if (json.meta.visibility === 'not_found') {
              return {
                status: 'not-found',
                services: [],
              };
            }
            this.provider = json.meta.definitionId;
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
        );
      }),
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
    return this.$observable;
  }

  reload() {
    this.$reload.next({
      type: 'reload',
      url: this.url,
      provider: this.provider,
    });
  }
}
