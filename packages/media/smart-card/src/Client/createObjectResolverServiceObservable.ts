import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';
import { Command, ObjectState, AuthService, ObjectStatus } from './types';
import fetch$ from './fetch';
import {
  startWith,
  filter,
  flatMap,
  map,
  tap,
  publishReplay,
  refCount,
  catchError,
  onErrorResumeNext,
} from 'rxjs/operators';
import { delay } from 'rxjs/operators/delay';

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

const responseToStateMapper = (definitionId?: string) => (
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

export type Options = {
  serviceUrl: string;
  objectUrl: string;
  definitionId?: string;
};

export function createObjectResolverServiceObservable(
  options: Options,
): Observable<ObjectState> {
  const { serviceUrl, objectUrl, definitionId } = options;

  return merge(
    of({ status: 'resolving', services: [] } as ObjectState),
    fetch$<ResolveResponse>('post', `${serviceUrl}/resolve`, {
      resourceUrl: encodeURI(objectUrl),
    }).pipe(
      map(responseToStateMapper(definitionId)),
      onErrorResumeNext(
        of({
          status: 'errored',
          services: [],
        } as ObjectState),
      ),
    ),
  ).pipe(publishReplay(1), refCount());
}
