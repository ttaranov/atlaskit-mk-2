import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import fetch$ from './fetch';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { ObjectState, ObjectStatus, AuthService } from './types';
import { inFisrtArrayButNotInSecond } from './utils';

// TODO: add some form of caching so that urls not currently loaded will still be fast

const SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver';

export type MapDefinitionIdToUrls = {
  [k: string]: Array<string>;
};

export type CustomFetch = (url: string) => Promise<ResolveResponse> | null;
export type CardUpdateCallback = (state: ObjectState) => void;

export type CardRecord = {
  uuid: string;
  fn: CardUpdateCallback;
};

// map definition id to trigger update function
export type MapUrlToCardRecords = {
  [k: string]: Array<CardRecord>;
};

export type RemoteResourceAuthConfig = {
  key: string;
  displayName: string;
  url: string;
};

// @see https://product-fabric.atlassian.net/wiki/spaces/CS/pages/279347271/Object+Provider
export type ResolveResponse = {
  meta: {
    visibility: 'public' | 'restricted' | 'other' | 'not_found';
    access: 'granted' | 'unauthorized' | 'forbidden';
    auth: RemoteResourceAuthConfig[];
    definitionId: string;
  };
  data?: {
    [name: string]: any;
  };
};

const convertAuthToService = (auth: {
  key: string;
  displayName: string;
  url: string;
}): AuthService => ({
  id: auth.key,
  name: auth.displayName,
  startAuthUrl: auth.url,
});

const statusByAccess = (
  status: ObjectStatus,
  json: ResolveResponse,
): ObjectState => ({
  status: status,
  definitionId: json.meta.definitionId,
  services: json.meta.auth.map(convertAuthToService),
  data: json.data,
});

const responseToStateMapper = (json: ResolveResponse): ObjectState => {
  if (json.meta.visibility === 'not_found') {
    return {
      status: 'not-found',
      definitionId: undefined,
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

/**
 * 1. we map a DefinitionId to a list of Urls.
 * Say we have multiple google cards
 * that should use the same definitionId
 *
 * 2. we map each Url to a list of Update functions.
 * As such, we might have different cards
 * with the same URL (and definitionId, see 1)
 */
export const getUrlsNotTiedToDefinitionId = (
  defIdToUrls: MapDefinitionIdToUrls,
  urlToCardRecords: MapUrlToCardRecords,
): Array<string> => {
  const urlsBoundToDefId = Object.keys(defIdToUrls)
    .map(defId => defIdToUrls[defId])
    .reduce((res: string[], urls: string[]) => res.concat(urls), []);
  return inFisrtArrayButNotInSecond(
    Object.keys(urlToCardRecords),
    urlsBoundToDefId,
  );
};

const unlinkLinkedCardForDefinitionId = (
  urlToResolve: string,
  connectedUrl: string[],
): string[] => {
  return connectedUrl.filter(url => url !== urlToResolve);
};

const linkUrlToDefinitionId = (
  newUrl: string,
  mapping: string[] | undefined,
): string[] => {
  return (mapping || []).concat([newUrl]);
};

export interface Client {
  fetchData(url: string): Promise<ResolveResponse>;
}

export class Client implements Client {
  private readonly mapDefinitionIdToUrls: MapDefinitionIdToUrls;
  private readonly mapUrlToCardRecords: MapUrlToCardRecords;

  constructor() {
    this.mapDefinitionIdToUrls = {};
    this.mapUrlToCardRecords = {};
  }

  fetchData(objectUrl: string): Promise<ResolveResponse> {
    return fetch$<ResolveResponse>('post', `${SERVICE_URL}/resolve`, {
      resourceUrl: encodeURI(objectUrl),
    }).toPromise();
  }

  startStreaming(objectUrl: string): Observable<ObjectState> {
    return merge(
      of({ status: 'resolving', services: [] } as ObjectState),
      fromPromise(this.fetchData(objectUrl)).pipe(
        map(responseToStateMapper),
        catchError(() =>
          of({ status: 'errored', services: [] } as ObjectState),
        ),
      ),
    );
  }

  /**
   * A card should register itself using this method.
   *
   * We're trying to match a DefinitionId to a bunch of URLs and each URL to a callback.
   *
   * As such, when a card gives us the URL we can fetch data+DefinitionId from the ORS,
   * then use that definitionId to find cards that has to be updated.
   *
   * @param url the url that card holds
   * @param fn the callback that can be called after the data has been resolved for that card.
   */
  register(url: string, uuid: string, fn: CardUpdateCallback): Client {
    this.mapUrlToCardRecords[url] = (
      this.mapUrlToCardRecords[url] || []
    ).concat([{ uuid, fn }]);
    return this;
  }

  // let's say when a card gets unmounted, we need to "clean-up"
  deregister(url: string, uuid: string): Client {
    if (this.mapUrlToCardRecords[url]) {
      this.mapUrlToCardRecords[url] = this.mapUrlToCardRecords[url].filter(
        rec => rec.uuid !== uuid,
      );
    }
    return this;
  }

  /**
   * A card can use this to retrieve data from ORS via this client.
   * Each card, gived it was registered beforehand, may call this method to retrieve
   * data per its URL. It will fetch data from ORS for the `URL`, then match
   * definitionId (from response) -> Url (from card) -> updateFn (from card)
   * Note: we use card's url as an identifier.
   *
   * Note: this one really needs to be refactored. It simply does to much...
   *
   * @param urlToResolve the url of a remote resoulrce a card wants to be resolved
   * @param definitionIdFromCard optional definition id that card already has
   * @param cb optional this is a way to do something only when it is needed.
   */
  resolve(urlToResolve: string, definitionIdFromCard?: string, cb?: Function) {
    if (!this.mapUrlToCardRecords[urlToResolve]) {
      throw new Error('Please, register a smart card before calling get()');
    }
    this.startStreaming(urlToResolve).subscribe(orsResponse => {
      // If a card was good (has definitionId) but then fetch errored for it,
      // we need to remove it from the map, so that later on, on retry, we could find cards that need to be updated
      if (definitionIdFromCard && orsResponse.status === 'errored') {
        this.mapDefinitionIdToUrls[
          definitionIdFromCard
        ] = unlinkLinkedCardForDefinitionId(
          urlToResolve,
          this.mapDefinitionIdToUrls[definitionIdFromCard],
        );
      }

      if (orsResponse.definitionId) {
        // if a card has not provided any definition id, it means that that card
        // has either errored or is loading for the fist time.
        // and, as long as we received the definitionId for that url,
        // we can assign the card's url to the definitionId
        // Later we can map this url to find an update function using `mapUrlToUpdateFn`
        if (!definitionIdFromCard) {
          this.mapDefinitionIdToUrls[
            orsResponse.definitionId
          ] = linkUrlToDefinitionId(
            urlToResolve,
            this.mapDefinitionIdToUrls[orsResponse.definitionId],
          );
        }

        const urls = this.mapDefinitionIdToUrls[orsResponse.definitionId];

        // try to find all the cards per url to be updated
        const urlsForDefinitionId = urls.filter(url => url === urlToResolve);

        urlsForDefinitionId
          .map(url => this.mapUrlToCardRecords[url])
          .forEach(recods => recods.forEach(record => record.fn(orsResponse)));

        // this cb is here mostly because we want to run an action
        // in a very particular case. For example, only when we reload a card.
        if (cb) {
          return cb();
        }
      } else {
        this.mapUrlToCardRecords[urlToResolve].forEach(rec =>
          rec.fn(orsResponse),
        );
      }
    });
  }

  // This one will be called, for example, when "try again" is clicked.
  reload(url: string, definitionIdFromCard?: string): void {
    if (definitionIdFromCard) {
      this.mapDefinitionIdToUrls[definitionIdFromCard].forEach(u =>
        this.resolve(u, definitionIdFromCard),
      );
    } else {
      this.resolve(url, undefined, () => {
        // say we have a bunch of errored cards without definitionId on them.
        // we clicked "Try again" on one of them and succeeded.
        // now we need to reload the cards that do not have a definitionId.
        getUrlsNotTiedToDefinitionId(
          this.mapDefinitionIdToUrls,
          this.mapUrlToCardRecords,
        ).forEach(url => this.resolve(url));
      });
    }
  }
}

export { ObjectStatus, ObjectState, AuthService };
