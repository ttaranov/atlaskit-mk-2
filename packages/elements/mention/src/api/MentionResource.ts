import {
  ServiceConfig,
  KeyValues,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';

import {
  MentionDescription,
  isAppMention,
  isTeamMention,
  MentionsResult,
} from '../types';
import debug from '../util/logger';
import { SearchIndex, mentionDescriptionComparator } from '../util/searchIndex';

const MAX_QUERY_ITEMS = 100;
const MAX_NOTIFIED_ITEMS = 20;

export type MentionStats = { [key: string]: any };

export interface ResultCallback<T> {
  (result: T, query?: string, stats?: MentionStats): void;
}

export interface ErrorCallback {
  (error: Error, query?: string): void;
}

export interface InfoCallback {
  (info: string): void;
}

export interface MentionResourceConfig extends ServiceConfig {
  containerId?: string;
  productId?: string;
  shouldHighlightMention?: (mention: MentionDescription) => boolean;

  /**
   * Hook for consumers to provide a list of users in the current context.
   * Users provided here will be searched when mentioning and
   * will appear first.
   *
   * @returns {Promise<MentionDescription[]>}
   */
  getUsersInContext?: () => Promise<MentionDescription[]>;
}

export interface ResourceProvider<Result> {
  /**
   * Subscribe to ResourceProvider results
   *
   * @param {string} key subscriber key used to unsubscribe
   * @param {ResultCallback<Result>} callback This callback only receives latest results
   * @param {ErrorCallback} errCallback This callback will errors
   * @param {InfoCallback} infoCallback This callback will info
   * @param {ResultCallback<Result>} allResultsCallback This callback will receive all results
   */
  subscribe(
    key: string,
    callback?: ResultCallback<Result>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<Result>,
  ): void;

  /**
   * Unsubscribe to this resource provider results
   * @param {string} key key used when subscribing
   */
  unsubscribe(key: string): void;
}

export type MentionContextIdentifier = {
  containerId?: string;
  objectId?: string;
  childObjectId?: string;
  sessionId?: string;
};

export interface MentionProvider
  extends ResourceProvider<MentionDescription[]> {
  filter(query?: string): void;
  recordMentionSelection(mention: MentionDescription): void;
  shouldHighlightMention(mention: MentionDescription): boolean;
  isFiltering(query: string): boolean;
}

const emptySecurityProvider = () => {
  return {
    params: {},
    headers: {},
  };
};

type SearchResponse = {
  mentions: Promise<MentionsResult>;
  remoteSearch: boolean;
};

class AbstractResource<Result> implements ResourceProvider<Result> {
  protected changeListeners: Map<string, ResultCallback<Result>>;
  protected errListeners: Map<string, ErrorCallback>;
  protected infoListeners: Map<string, InfoCallback>;
  protected allResultsListeners: Map<string, ResultCallback<Result>>;

  constructor() {
    this.changeListeners = new Map<string, ResultCallback<Result>>();
    this.allResultsListeners = new Map<string, ResultCallback<Result>>();
    this.errListeners = new Map<string, ErrorCallback>();
    this.infoListeners = new Map<string, InfoCallback>();
  }

  subscribe(
    key: string,
    callback?: ResultCallback<Result>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<Result>,
  ): void {
    if (callback) {
      this.changeListeners.set(key, callback);
    }
    if (errCallback) {
      this.errListeners.set(key, errCallback);
    }
    if (infoCallback) {
      this.infoListeners.set(key, infoCallback);
    }
    if (allResultsCallback) {
      this.allResultsListeners.set(key, allResultsCallback);
    }
  }

  unsubscribe(key: string): void {
    this.changeListeners.delete(key);
    this.errListeners.delete(key);
    this.infoListeners.delete(key);
    this.allResultsListeners.delete(key);
  }
}

class AbstractMentionResource extends AbstractResource<MentionDescription[]>
  implements MentionProvider {
  shouldHighlightMention(mention: MentionDescription): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  filter(query?: string): void {
    throw new Error(`not yet implemented.\nParams: query=${query}`);
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  recordMentionSelection(mention: MentionDescription): void {
    // Do nothing
  }

  isFiltering(query: string): boolean {
    return false;
  }

  protected _notifyListeners(
    mentionsResult: MentionsResult,
    stats?: MentionStats,
  ): void {
    debug(
      'ak-mention-resource._notifyListeners',
      mentionsResult &&
        mentionsResult.mentions &&
        mentionsResult.mentions.length,
      this.changeListeners,
    );

    this.changeListeners.forEach((listener, key) => {
      try {
        listener(
          mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS),
          mentionsResult.query,
          stats,
        );
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyAllResultsListeners(mentionsResult: MentionsResult): void {
    debug(
      'ak-mention-resource._notifyAllResultsListeners',
      mentionsResult &&
        mentionsResult.mentions &&
        mentionsResult.mentions.length,
      this.changeListeners,
    );

    this.allResultsListeners.forEach((listener, key) => {
      try {
        listener(
          mentionsResult.mentions.slice(0, MAX_NOTIFIED_ITEMS),
          mentionsResult.query,
        );
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyErrorListeners(error: Error, query?: string): void {
    this.errListeners.forEach((listener, key) => {
      try {
        listener(error, query);
      } catch (e) {
        // ignore error from listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }

  protected _notifyInfoListeners(info: string): void {
    this.infoListeners.forEach((listener, key) => {
      try {
        listener(info);
      } catch (e) {
        // ignore error fromr listener
        debug(`error from listener '${key}', ignoring`, e);
      }
    });
  }
}

/**
 * Provides a Javascript API
 */
class MentionResource extends AbstractMentionResource {
  private config: MentionResourceConfig;
  private lastReturnedSearch: number;
  private searchIndex: SearchIndex;
  private activeSearches: Set<string>;

  constructor(config: MentionResourceConfig) {
    super();

    if (!config.url) {
      throw new Error('config.url is a required parameter');
    }

    if (!config.securityProvider) {
      config['securityProvider'] = emptySecurityProvider;
    }

    this.config = config;
    this.lastReturnedSearch = 0;
    this.searchIndex = new SearchIndex();
    this.activeSearches = new Set();
  }

  shouldHighlightMention(mention: MentionDescription) {
    if (this.config.shouldHighlightMention) {
      return this.config.shouldHighlightMention(mention);
    }

    return false;
  }

  notify(
    searchTime: number,
    mentionResult: MentionsResult,
    query?: string,
    remoteSearch?: boolean,
  ) {
    this.sortMentionsResult(mentionResult).then(sortedMentionsResult => {
      if (searchTime > this.lastReturnedSearch) {
        this.lastReturnedSearch = searchTime;
        this._notifyListeners(sortedMentionsResult, {
          duration: Date.now() - searchTime,
          remoteSearch,
        });
      } else {
        const date = new Date(searchTime).toISOString().substr(17, 6);
        debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
      }

      this._notifyAllResultsListeners(sortedMentionsResult);
    });
  }

  notifyError(error: Error, query?: string) {
    this._notifyErrorListeners(error, query);
    if (query) {
      this.activeSearches.delete(query);
    }
  }

  filter(query?: string, contextIdentifier?: MentionContextIdentifier): void {
    const searchTime = Date.now();

    if (!query) {
      this.initialState(contextIdentifier).then(
        results => this.notify(searchTime, results, query, true),
        error => this.notifyError(error, query),
      );
    } else {
      this.activeSearches.add(query);
      const searchResponse = this.search(query, contextIdentifier);

      searchResponse.mentions.then(
        results => {
          this.notify(searchTime, results, query, searchResponse.remoteSearch);
        },
        error => this.notifyError(error, query),
      );
    }
  }

  recordMentionSelection(
    mention: MentionDescription,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    return this.recordSelection(mention, contextIdentifier).then(
      () => {},
      error => debug(`error recording mention selection: ${error}`, error),
    );
  }

  isFiltering(query: string): boolean {
    return this.activeSearches.has(query);
  }

  private initialState(
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    return this.remoteInitialState(contextIdentifier);
  }

  private getUserIdsInContext(): Promise<Set<string>> {
    if (this.config.getUsersInContext) {
      return this.config
        .getUsersInContext()
        .then(users =>
          users.reduce((acc, value) => acc.add(value.id), new Set()),
        );
    }

    return Promise.resolve(new Set());
  }

  private getQueryParams(
    contextIdentifier?: MentionContextIdentifier,
  ): KeyValues {
    const configParams: KeyValues = {};

    if (this.config.containerId) {
      configParams['containerId'] = this.config.containerId;
    }

    if (this.config.productId) {
      configParams['productIdentifier'] = this.config.productId;
    }

    // if contextParams exist then it will override configParams for containerId
    return { ...configParams, ...contextIdentifier };
  }

  /**
   * Returns the initial mention display list before a search is performed for the specified
   * container.
   *
   * @param contextIdentifier
   * @returns Promise
   */
  private remoteInitialState(
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const queryParams: KeyValues = this.getQueryParams(contextIdentifier);
    const options = {
      path: 'bootstrap',
      queryParams,
    };

    return serviceUtils
      .requestService<MentionsResult>(this.config, options)
      .then(result => this.transformServiceResponse(result, ''))
      .then(result => {
        this.searchIndex.indexResults(result.mentions);
        return result;
      });
  }

  private searchAsync(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): void {
    const searchTime = Date.now() + 1; // Ensure that search time is different than the local search time
    this.remoteSearch(query, contextIdentifier).then(
      result => {
        this.activeSearches.delete(query);
        this.notify(searchTime, result, query, true);
        this.searchIndex.indexResults(result.mentions);
      },
      err => {
        this._notifyErrorListeners(err);
      },
    );
  }

  private search(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): SearchResponse {
    if (this.searchIndex.hasDocuments()) {
      return {
        mentions: this.searchIndex.search(query).then(result => {
          this.searchAsync(query, contextIdentifier);
          // return local search result quickly while the back-end search runs async
          return result;
        }),
        remoteSearch: false, // due to be returning the local search results above
      };
    }
    return {
      mentions: this.remoteSearch(query, contextIdentifier).then(result => {
        this.searchIndex.indexResults(result.mentions);
        return result;
      }),
      remoteSearch: true,
    };
  }

  private sortMentionsResult(
    mentionsResult: MentionsResult,
  ): Promise<MentionsResult> {
    return this.getUserIdsInContext().then(userIdsInContext => {
      return {
        ...mentionsResult,
        mentions: mentionsResult.mentions.sort(
          mentionDescriptionComparator(userIdsInContext),
        ),
      };
    });
  }

  private remoteSearch(
    query: string,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<MentionsResult> {
    const options = {
      path: 'search',
      queryParams: {
        query,
        limit: MAX_QUERY_ITEMS,
        ...this.getQueryParams(contextIdentifier),
      },
    };

    return serviceUtils
      .requestService<MentionsResult>(this.config, options)
      .then(result => this.transformServiceResponse(result, query));
  }

  private transformServiceResponse(
    result: MentionsResult,
    query: string,
  ): MentionsResult {
    const mentions = result.mentions.map((mention, index) => {
      let lozenge: string | undefined;
      const weight = mention.weight !== undefined ? mention.weight : index;
      if (isAppMention(mention)) {
        lozenge = mention.userType;
      } else if (isTeamMention(mention)) {
        lozenge = mention.userType;
      }

      return { ...mention, lozenge, weight, query };
    });

    return { ...result, mentions, query: result.query || query };
  }

  private recordSelection(
    mention: MentionDescription,
    contextIdentifier?: MentionContextIdentifier,
  ): Promise<void> {
    const options = {
      path: 'record',
      queryParams: {
        selectedUserId: mention.id,
        ...this.getQueryParams(contextIdentifier),
      },
      requestInit: {
        method: 'POST',
      },
    };

    return serviceUtils.requestService<void>(this.config, options);
  }
}

export class HttpError implements Error {
  name: string;
  message: string;
  statusCode: number;
  stack?: string;

  constructor(statusCode: number, statusMessage: string) {
    this.statusCode = statusCode;
    this.message = statusMessage;
    this.name = 'HttpError';
    this.stack = new Error().stack;
  }
}

export { AbstractResource, AbstractMentionResource };
export default MentionResource;
