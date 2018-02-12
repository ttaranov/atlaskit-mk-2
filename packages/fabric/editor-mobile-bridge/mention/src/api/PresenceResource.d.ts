import { Presence } from '../types';
import { AbstractResource, ResourceProvider } from './MentionResource';
export interface PresenceMap {
  [userId: string]: Presence;
}
export interface PresenceResourceConfig {
  url: string;
  cloudId: string;
  productId?: string;
  cache?: PresenceCache;
  cacheExpiry?: number;
  parser?: PresenceParser;
}
export interface PresenceCache {
  contains(userId: string): boolean;
  get(userId: string): Presence;
  getBulk(userIds: string[]): PresenceMap;
  getMissingUserIds(userIds: string[]): string[];
  update(presUpdate: PresenceMap): void;
}
export interface PresenceParser {
  mapState(state: string): string;
  parse(response: Response): PresenceMap;
}
export interface PresenceProvider extends ResourceProvider<PresenceMap> {
  refreshPresence(userIds: string[]): void;
}
declare class AbstractPresenceResource extends AbstractResource<PresenceMap>
  implements PresenceProvider {
  refreshPresence(userIds: string[]): void;
  protected notifyListeners(presences: PresenceMap): void;
}
declare class PresenceResource extends AbstractPresenceResource {
  private config;
  private presenceCache;
  private presenceParser;
  constructor(config: PresenceResourceConfig);
  refreshPresence(userIds: string[]): void;
  private retrievePresence(userIds);
  private queryDirectoryForPresences(userIds);
  private static cleanUrl(url);
}
export declare class DefaultPresenceCache implements PresenceCache {
  private static readonly defaultTimeout;
  private static readonly defaultFlushTrigger;
  private cache;
  private size;
  private expiryInMillis;
  private flushTrigger;
  constructor(cacheTimeout?: number, cacheTrigger?: number);
  /**
   * Precondition: _delete is only called internally if userId exists in cache
   * Removes cache entry
   * @param userId
   */
  private _delete(userId);
  /**
   * Checks a cache entry and calls delete if the info has expired
   * @param userId
   */
  private _deleteIfExpired(userId);
  /**
   * Cleans expired entries from cache
   */
  private _removeExpired();
  /**
   * Checks if a user exists in the cache
   * @param userId
   */
  contains(userId: string): boolean;
  /**
   * Retrieves a presence from the cache after checking for expired entries
   * @param userId - to index the cache
   * @returns Presence - the presence that matches the userId
   */
  get(userId: string): Presence;
  /**
   * Retrieve multiple presences at once from the cache
   * @param userIds - to index the cache
   * @returns PresenceMap - A map of userIds to cached Presences
   */
  getBulk(userIds: string[]): PresenceMap;
  /**
   * For a given list of ids, returns a subset
   * of all the ids with missing cache entries.
   * @param userIds - to index the cache
   * @returns string[] - ids missing from the cache
   */
  getMissingUserIds(userIds: string[]): string[];
  /**
   * Precondition: presMap only contains ids of users not in cache
   *               expired users must first be removed then reinserted with updated presence
   * Updates the cache by adding the new Presence entries and setting the expiry time
   * @param presMap
   */
  update(presMap: PresenceMap): void;
}
export declare class DefaultPresenceParser implements PresenceParser {
  static FOCUS_STATE: string;
  mapState(state: string): string;
  parse(response: Response): PresenceMap;
  private static extractState(presence);
  private static isFocusState(presence);
}
export { AbstractPresenceResource };
export default PresenceResource;
