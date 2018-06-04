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

export type Status =
  | 'resolving'
  | 'not-found'
  | 'resolved'
  | 'unauthorised'
  | 'forbidden'
  | 'errored';

export interface Service {
  id: string;
  name: string;
  startAuthUrl: string;
}

export interface State {
  status: Status;
  provider?: string;
  services: Service[];
  data?: { [name: string]: any };
}

function convertAuthToService(auth: {
  key: string;
  displayName: string;
  url: string;
}): Service {
  return {
    id: auth.key,
    name: auth.displayName,
    startAuthUrl: auth.url,
  };
}

export class Options {
  serviceUrl: string;
  objectUrl: string;
  $commands: Subject<Command>;
}

export function createObjectStateObservable(url: string, options: Options) {
  const { serviceUrl, objectUrl, $commands } = options;

  let provider: string | undefined;

  return $commands.pipe(
    startWith({
      type: 'init',
    }),
    switchMap((cmd: Command) => {
      // ignore reloads for other providers
      if (cmd.type === 'reload' && cmd.provider !== provider) {
        return Observable.of();
      }

      return fetch<ResolveResponse>('post', `${serviceUrl}/resolve`, {
        resourceUrl: encodeURI(objectUrl),
      }).pipe(
        map<ResolveResponse, State>(json => {
          if (json.meta.visibility === 'not_found') {
            return {
              status: 'not-found',
              provider,
              services: [],
            };
          }
          provider = json.meta.definitionId;
          switch (json.meta.access) {
            case 'forbidden':
              return {
                status: 'forbidden',
                provider,
                services: json.meta.auth.map(convertAuthToService),
                data: json.data,
              };

            case 'unauthorised':
              return {
                status: 'unauthorised',
                provider,
                services: json.meta.auth.map(convertAuthToService),
                data: json.data,
              };

            default:
              return {
                status: 'resolved',
                provider,
                services: json.meta.auth.map(convertAuthToService),
                data: json.data,
              };
          }
        }),
        startWith<State>({
          status: 'resolving',
          services: [],
        }),
      );
    }),
    catchError(() =>
      of<State>({
        status: 'errored',
        services: [],
      }),
    ),
    publishReplay(1),
    refCount(),
  );
}
