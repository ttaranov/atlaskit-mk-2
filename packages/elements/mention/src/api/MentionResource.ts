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

export interface ResultCallback<T> {
  (result: T, query?: string): void;
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

  protected _notifyListeners(mentionsResult: MentionsResult): void {
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

  notify(searchTime: number, mentionResult: MentionsResult, query?: string) {
    this.sortMentionsResult(mentionResult).then(sortedMentionsResult => {
      if (searchTime > this.lastReturnedSearch) {
        this.lastReturnedSearch = searchTime;
        this._notifyListeners(sortedMentionsResult);
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

  filter(query?: string): void {
    const searchTime = Date.now();

    if (!query) {
      this.initialState().then(
        results => this.notify(searchTime, results, query),
        error => this.notifyError(error, query),
      );
    } else {
      this.activeSearches.add(query);
      this.search(query).then(
        results => this.notify(searchTime, results, query),
        error => this.notifyError(error, query),
      );
    }
  }

  recordMentionSelection(mention: MentionDescription): Promise<void> {
    return this.recordSelection(mention).then(
      () => {},
      error => debug(`error recording mention selection: ${error}`, error),
    );
  }

  isFiltering(query: string): boolean {
    return this.activeSearches.has(query);
  }

  private initialState(): Promise<MentionsResult> {
    return this.remoteInitialState();
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

  /**
   * Returns the initial mention display list before a search is performed for the specified
   * container.
   *
   * @param containerId
   * @returns Promise
   */
  private remoteInitialState(): Promise<MentionsResult> {
    const queryParams: KeyValues = {};

    if (this.config.containerId) {
      queryParams['containerId'] = this.config.containerId;
    }

    if (this.config.productId) {
      queryParams['productIdentifier'] = this.config.productId;
    }

    const options = {
      path: 'bootstrap',
      queryParams,
    };

    return serviceUtils
      .requestService<MentionsResult>(this.config, options)
      .then(result => this.transformServiceResponse(result))
      .then(result => {
        this.searchIndex.indexResults(result.mentions);
        return result;
      });
  }

  private search(query: string): Promise<MentionsResult> {
    if (this.searchIndex.hasDocuments()) {
      return this.searchIndex.search(query).then(result => {
        const searchTime = Date.now() + 1; // Ensure that search time is different than the local search time
        this.remoteSearch(query).then(
          result => {
            this.activeSearches.delete(query);
            this.notify(searchTime, result, query);
            this.searchIndex.indexResults(result.mentions);
          },
          err => {
            this._notifyErrorListeners(err);
          },
        );

        return result;
      });
    }

    return this.remoteSearch(query).then(result => {
      this.searchIndex.indexResults(result.mentions);
      return result;
    });
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

  private remoteSearch(query: string): Promise<MentionsResult> {
    const queryParams = {
      query,
      limit: MAX_QUERY_ITEMS,
    };

    if (this.config.containerId) {
      queryParams['containerId'] = this.config.containerId;
    }

    if (this.config.productId) {
      queryParams['productIdentifier'] = this.config.productId;
    }

    const options = {
      path: 'search',
      queryParams,
    };

    return serviceUtils
      .requestService<MentionsResult>(this.config, options)
      .then(result => this.transformServiceResponse(result));
  }

  private transformServiceResponse(result: MentionsResult): MentionsResult {
    const mentions = result.mentions.map((mention, index) => {
      let lozenge: string | undefined;
      const weight = mention.weight !== undefined ? mention.weight : index;
      if (isAppMention(mention)) {
        lozenge = mention.userType;
      } else if (isTeamMention(mention)) {
        lozenge = mention.userType;
      }

      return { ...mention, lozenge, weight };
    });

    return { ...result, mentions };
  }

  private recordSelection(mention: MentionDescription): Promise<void> {
    const queryParams = {
      selectedUserId: mention.id,
    };

    if (this.config.productId) {
      queryParams['productIdentifier'] = this.config.productId;
    }

    const options = {
      path: 'record',
      queryParams,
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
