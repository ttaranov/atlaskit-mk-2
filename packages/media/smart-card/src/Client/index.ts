import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import {
  ObjectState,
  ObjectStatus,
  AuthService,
  TemporaryResolver,
} from './types';
import { createObjectResolverServiceObservable } from './createObjectResolverServiceObservable';
import { createTemporaryResolverObservable } from './createTemporaryResolverObservable';
import { filter } from 'rxjs/operators/filter';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { inFisrtArrayButNotInSecond } from './utils';

// TODO: add some form of caching so that urls not currently loaded will still be fast

export interface ClientOptions {
  serviceUrl?: string;
  TEMPORARY_resolver?: TemporaryResolver;
}

export type MapDefinitionIdToUrls = {
  [k: string]: Array<string>;
};

export type CardRecord = {
  uuid: string;
  fn: (state: ObjectState) => void;
};

// map definition id to trigger update function
export type MapUrlToCardRecords = {
  [k: string]: Array<CardRecord>;
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

const onlyPositiveResponses = (e: string): boolean =>
  ['resolving', 'resolved', 'unauthorized', 'forbidden'].indexOf(e) > -1;

export class Client {
  static SERVICE_URL = 'https://api-private.stg.atlassian.com/object-resolver'; // TODO: use prod URL here

  private readonly serviceUrl: string;
  private readonly temporaryResolver?: TemporaryResolver;
  private readonly mapDefinitionIdToUrls: MapDefinitionIdToUrls;
  private readonly mapUrlToCardRecords: MapUrlToCardRecords;

  constructor(options: ClientOptions = {}) {
    const { serviceUrl = Client.SERVICE_URL } = options;
    this.serviceUrl = serviceUrl;
    this.temporaryResolver = options.TEMPORARY_resolver;
    this.mapDefinitionIdToUrls = {};
    this.mapUrlToCardRecords = {};
  }

  fetchData(url: string): Observable<ObjectState> {
    const payload = {
      serviceUrl: this.serviceUrl,
      objectUrl: url,
    };
    if (this.temporaryResolver) {
      return merge(
        createTemporaryResolverObservable(url, this.temporaryResolver),
        createObjectResolverServiceObservable(payload),
      ).pipe(
        filter(state => onlyPositiveResponses(state.status)),
        distinctUntilChanged((p, n) => p.status === n.status),
      );
    } else {
      return createObjectResolverServiceObservable(payload);
    }
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
  register(
    url: string,
    uuid: string,
    fn: (state: ObjectState) => void,
  ): Client {
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
   * @param url the url of a remote resoulrce a card wants to be resolved
   * @param definitionIdFromCard optional definition id that card already has
   * @param cb optional this is a way to do something only when it is needed.
   */
  resolve(url: string, definitionIdFromCard?: string, cb?: () => void) {
    if (!this.mapUrlToCardRecords[url]) {
      throw new Error('Please, register a smart card before calling get()');
    }
    this.fetchData(url).subscribe(orsResponse => {
      // If a card was good (has definitionId) but then fetch errored for it,
      // we need to remove it from the map, so that later on, on retry, we could find cards that need to be updated
      if (definitionIdFromCard && orsResponse.status === 'errored') {
        this.mapDefinitionIdToUrls[
          definitionIdFromCard
        ] = this.mapDefinitionIdToUrls[definitionIdFromCard].filter(
          mappedUrl => mappedUrl !== url,
        );
      }

      if (orsResponse.definitionId) {
        // if a card has not provided any definition id, it means that that card
        // has either errored or is loading for the fist time.
        // and, as long as we received the definitionId for that url,
        // we can assign the card's url to the definitionId
        // Later we can map this url to find an update function using `mapUrlToUpdateFn`
        if (!definitionIdFromCard) {
          this.mapDefinitionIdToUrls[orsResponse.definitionId] = (
            this.mapDefinitionIdToUrls[orsResponse.definitionId] || []
          ).concat([url]);
        }

        const urls = this.mapDefinitionIdToUrls[orsResponse.definitionId];

        // among all the urls find the one, for that particular card.
        urls
          .map(url => this.mapUrlToCardRecords[url])
          .forEach(recods => recods.forEach(record => record.fn(orsResponse)));

        // this cb is here mostly because we want to run an action
        // in a very particular case. For example, only when we reload a card.
        if (cb) {
          return cb();
        }
      } else {
        this.mapUrlToCardRecords[url].forEach(rec => rec.fn(orsResponse));
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
