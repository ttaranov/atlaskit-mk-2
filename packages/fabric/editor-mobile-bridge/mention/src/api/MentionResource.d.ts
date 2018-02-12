import { ServiceConfig } from '@atlaskit/util-service-support';
import { MentionDescription, MentionsResult } from '../types';
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
declare class AbstractResource<Result> implements ResourceProvider<Result> {
  protected changeListeners: Map<string, ResultCallback<Result>>;
  protected errListeners: Map<string, ErrorCallback>;
  protected infoListeners: Map<string, InfoCallback>;
  protected allResultsListeners: Map<string, ResultCallback<Result>>;
  constructor();
  subscribe(
    key: string,
    callback?: ResultCallback<Result>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<Result>,
  ): void;
  unsubscribe(key: string): void;
}
declare class AbstractMentionResource extends AbstractResource<
  MentionDescription[]
> implements MentionProvider {
  shouldHighlightMention(mention: MentionDescription): boolean;
  filter(query?: string): void;
  recordMentionSelection(mention: MentionDescription): void;
  isFiltering(query: string): boolean;
  protected _notifyListeners(mentionsResult: MentionsResult): void;
  protected _notifyAllResultsListeners(mentionsResult: MentionsResult): void;
  protected _notifyErrorListeners(error: Error, query?: string): void;
  protected _notifyInfoListeners(info: string): void;
}
/**
 * Provides a Javascript API
 */
declare class MentionResource extends AbstractMentionResource {
  private config;
  private lastReturnedSearch;
  private searchIndex;
  private activeSearches;
  constructor(config: MentionResourceConfig);
  shouldHighlightMention(mention: MentionDescription): boolean;
  notify(
    searchTime: number,
    mentionResult: MentionsResult,
    query?: string,
  ): void;
  notifyError(error: Error, query?: string): void;
  filter(query?: string): void;
  recordMentionSelection(mention: MentionDescription): Promise<void>;
  isFiltering(query: string): boolean;
  private initialState();
  private getUserIdsInContext();
  /**
   * Returns the initial mention display list before a search is performed for the specified
   * container.
   *
   * @param containerId
   * @returns Promise
   */
  private remoteInitialState();
  private search(query);
  private sortMentionsResult(mentionsResult);
  private remoteSearch(query);
  private transformServiceResponse(result);
  private recordSelection(mention);
}
export declare class HttpError implements Error {
  name: string;
  message: string;
  statusCode: number;
  stack?: string;
  constructor(statusCode: number, statusMessage: string);
}
export { AbstractResource, AbstractMentionResource };
export default MentionResource;
