export type SortCriteria = 'lastUpdateDate' | 'creationDate';

export type Cursor = string;
export interface Query {
  containerAri: string;
  limit?: number;
  cursor?: Cursor;
  sortCriteria?: SortCriteria;
}

export type RecentUpdatesId = string;

export interface RecentUpdateContext {
  containerAri: string;
  localId?: string;
}

/**
 * A subscriber interface that can be called back if there are new decisions/tasks/items
 * available as the result of an external change.
 */
export interface RecentUpdatesListener {
  /**
   * An id that can be used to unsubscribe
   */
  id(id: RecentUpdatesId);

  /**
   * Indicates there are recent updates, and the listener should refresh
   * the latest items from the TaskDecisionProvider.
   *
   * There will be a number of retries until expectedLocalId, if passed.
   *
   * @param updateContext Recent update context
   */
  recentUpdates(updateContext: RecentUpdateContext);
}

export interface User {
  id: string;
  displayName: string;
  nickname?: string;
  avatarUrl: string;
}

export interface ObjectKey {
  localId: string;
  containerAri: string;
  objectAri: string;
}

export type DecisionType = 'DECISION';
export type TaskType = 'TASK';
export type DecisionState = 'DECIDED';
export type DecisionStatus = 'CREATED';
export interface BaseItem<S> extends ObjectKey {
  state: S;
  lastUpdateDate: Date;
  type: DecisionType | TaskType;
}

export interface Decision extends BaseItem<DecisionState> {
  creationDate: Date;
  creator?: User;
  lastUpdater?: User;
  lastUpdateDate: Date;
  participants: User[];
  // Atlassian Document fragment
  content: any;
  status: DecisionStatus;
  type: DecisionType;
}

export interface DecisionResponse {
  decisions: Decision[];
  nextQuery?: Query;
}

export interface TaskResponse {
  tasks: Task[];
  nextQuery?: Query;
}

export type Item = Decision | Task;

export interface ItemResponse {
  items: Item[];
  nextQuery?: Query;
}

export type TaskState = 'TODO' | 'DONE';
export interface Task extends BaseItem<TaskState> {
  creationDate: Date;
  creator?: User;
  lastUpdater?: User;
  lastUpdateDate: Date;
  parentLocalId: string;
  participants: User[];
  position: number;
  // Atlassian Document fragment
  content: any;
  type: TaskType;
}

export type Handler = (state: TaskState | DecisionState) => void;

export default interface TaskDecisionProvider {
  getDecisions(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<DecisionResponse>;
  getTasks(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<TaskResponse>;
  getItems(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<ItemResponse>;

  unsubscribeRecentUpdates(id: RecentUpdatesId);
  notifyRecentUpdates(updateContext: RecentUpdateContext);

  // Tasks
  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
  subscribe(objectKey: ObjectKey, handler: Handler): void;
  unsubscribe(objectKey: ObjectKey, handler: Handler): void;
  getCurrentUser?(): User | undefined;
};
