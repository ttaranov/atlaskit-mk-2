import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { Command, ObjectState, AuthService, ObjectStatus } from './types';
import fetch$ from './fetch';
import {
  startWith,
  filter,
  flatMap,
  map,
  tap,
  catchError,
  publishReplay,
  refCount,
} from 'rxjs/operators';

export type RemoteResourceAuthConfig = {
  key: string;
  displayName: string;
  url: string;
};

// @see https://product-fabric.atlassian.net/wiki/spaces/CS/pages/279347271/Object+Provider
interface ResolveResponse {
  meta: {
    visibility: 'public' | 'restricted' | 'other' | 'not_found';
    access: 'granted' | 'unauthorized' | 'forbidden';
    auth: RemoteResourceAuthConfig[];
    definitionId: string;
  };
  data?: {
    [name: string]: any;
  };
}

function convertAuthToService(auth: {
  key: string;
  displayName: string;
  url: string;
}): AuthService {
  return {
    id: auth.key,
    name: auth.displayName,
    startAuthUrl: auth.url,
  };
}

function statusByAccess(
  status: ObjectStatus,
  json: ResolveResponse,
): ObjectState {
  return {
    status: status,
    definitionId: json.meta.definitionId,
    services: json.meta.auth.map(convertAuthToService),
    data: json.data,
  };
}

const responseToStateMapper = (definitionId: string | undefined) => (
  json: ResolveResponse,
): ObjectState => {
  if (json.meta.visibility === 'not_found') {
    return {
      status: 'not-found',
      definitionId: definitionId,
      services: [],
    };
  }
  switch (json.meta.access) {
    case 'forbidden':
      return statusByAccess('forbidden', json);
    case 'unauthorized':
      return statusByAccess('unauthorized', json);
    default:
      return statusByAccess('resolved', json);
  }
};

const runFetch = (
  serviceUrl: string,
  objectUrl: string,
): Observable<ResolveResponse> =>
  fetch$<ResolveResponse>('post', `${serviceUrl}/resolve`, {
    resourceUrl: encodeURI(objectUrl),
  });

export type Options = {
  serviceUrl: string;
  objectUrl: string;
  $commands: Subject<Command>;
};

export function createObjectResolverServiceObservable(options: Options) {
  const { serviceUrl, objectUrl, $commands } = options;

  let definitionId: string | undefined;

  return $commands.pipe(
    startWith({ type: 'init' } as Command),
    filter(
      cmd =>
        cmd.type === 'init' ||
        (cmd.type === 'reload' && cmd.provider === definitionId),
    ),
    flatMap(_ =>
      runFetch(serviceUrl, objectUrl).pipe(
        map(responseToStateMapper(definitionId)),
        tap(mapped => (definitionId = mapped.definitionId)),
        startWith({ status: 'resolving', services: [] } as ObjectState),
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
