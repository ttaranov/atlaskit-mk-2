import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';
import { ObjectState, AuthService, ObjectStatus } from './types';
import fetch$ from './fetch';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

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

const fetchData = (serviceUrl: string, objectUrl: string) =>
  fetch$<ResolveResponse>('post', `${serviceUrl}/resolve`, {
    resourceUrl: encodeURI(objectUrl),
  });

export const createObjectResolverServiceObservable = ({
  serviceUrl,
  objectUrl,
  definitionId,
}: Options): Observable<ObjectState> =>
  merge(
    of({ status: 'resolving', services: [] } as ObjectState),
    fetchData(serviceUrl, objectUrl).pipe(
      map(responseToStateMapper(definitionId)),
      catchError(() => of({ status: 'errored', services: [] } as ObjectState)),
    ),
  );
