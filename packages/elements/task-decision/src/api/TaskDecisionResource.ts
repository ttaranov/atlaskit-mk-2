import * as uuid from 'uuid';
import { RequestServiceOptions, utils } from '@atlaskit/util-service-support';
import { defaultLimit } from '../constants';

import {
  convertServiceDecisionResponseToDecisionResponse,
  convertServiceItemResponseToItemResponse,
  convertServiceTaskResponseToTaskResponse,
  convertServiceTaskToTask,
  findIndex,
  ResponseConverter,
} from './TaskDecisionUtils';

import {
  BaseItem,
  DecisionResponse,
  DecisionState,
  Handler,
  ItemResponse,
  ObjectKey,
  Query,
  RecentUpdateContext,
  RecentUpdatesId,
  RecentUpdatesListener,
  ServiceTask,
  TaskDecisionProvider,
  TaskDecisionResourceConfig,
  TaskResponse,
  TaskState,
  User,
} from '../types';

import { objectKeyToString, toggleTaskState } from '../type-helpers';

interface RecentUpdateByIdValue {
  listener: RecentUpdatesListener;
  containerAri: string;
}

export class RecentUpdates {
  private idsByContainer: Map<string, string[]> = new Map();
  private listenersById: Map<string, RecentUpdateByIdValue> = new Map();

  subscribe(
    containerAri: string,
    recentUpdatesListener: RecentUpdatesListener,
  ) {
    const id = uuid();
    let containerIds = this.idsByContainer.get(containerAri);
    if (!containerIds) {
      containerIds = [];
      this.idsByContainer.set(containerAri, containerIds);
    }
    containerIds.push(id);
    this.listenersById.set(id, {
      listener: recentUpdatesListener,
      containerAri,
    });
    // Notify of id
    recentUpdatesListener.id(id);
  }

  unsubscribe(unsubscribeId: RecentUpdatesId) {
    const listenerDetail = this.listenersById.get(unsubscribeId);
    if (listenerDetail) {
      this.listenersById.delete(unsubscribeId);
      const { containerAri } = listenerDetail;
      const idsToFilter = this.idsByContainer.get(containerAri);
      if (idsToFilter) {
        this.idsByContainer.set(
          containerAri,
          idsToFilter.filter(id => id !== unsubscribeId),
        );
      }
    }
  }

  notify(recentUpdateContext: RecentUpdateContext) {
    const { containerAri } = recentUpdateContext;
    const subscriberIds = this.idsByContainer.get(containerAri);
    if (subscriberIds) {
      subscriberIds.forEach(subscriberId => {
        const listenerDetail = this.listenersById.get(subscriberId);
        if (listenerDetail) {
          const { listener } = listenerDetail;
          listener.recentUpdates(recentUpdateContext);
        }
      });
    }
  }
}

export class ItemStateManager {
  private debouncedTaskStateQuery: number | null = null;
  private debouncedTaskToggle: Map<string, number> = new Map();
  private serviceConfig: TaskDecisionResourceConfig;
  private subscribers: Map<string, Handler[]> = new Map();
  private trackedObjectKeys: Map<string, ObjectKey> = new Map();
  private cachedItems: Map<
    string,
    BaseItem<TaskState | DecisionState>
  > = new Map();
  private batchedKeys: Map<string, ObjectKey> = new Map();

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.serviceConfig = serviceConfig;
  }

  destroy() {
    if (this.debouncedTaskStateQuery) {
      clearTimeout(this.debouncedTaskStateQuery);
    }

    this.debouncedTaskToggle.forEach(timeout => {
      clearTimeout(timeout);
    });
  }

  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState> {
    const stringKey = objectKeyToString(objectKey);
    const timeout = this.debouncedTaskToggle.get(stringKey);
    if (timeout) {
      clearTimeout(timeout);
      this.debouncedTaskToggle.delete(stringKey);
    }

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdated(objectKey, state);

    return new Promise<TaskState>((resolve, reject) => {
      this.debouncedTaskToggle.set(
        stringKey,
        setTimeout(() => {
          const options: RequestServiceOptions = {
            path: 'tasks',
            requestInit: {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json; charset=UTF-8',
              },
              body: JSON.stringify({
                ...objectKey,
                state,
              }),
            },
          };

          utils
            .requestService<ServiceTask>(this.serviceConfig, options)
            .then(convertServiceTaskToTask)
            .then(task => {
              const key = objectKeyToString(objectKey);
              this.cachedItems.set(key, task);

              resolve(state);
              // Notify subscribers that the task have been updated so that they can re-render accordingly
              this.notifyUpdated(objectKey, state);
            })
            .catch(() => {
              // Undo optimistic change
              this.notifyUpdated(objectKey, toggleTaskState(state));
              reject();
            });
        }, 500),
      );
    });
  }

  refreshAllTasks() {
    this.queueAllItems();
    this.scheduleGetTaskState();
  }

  subscribe(objectKey: ObjectKey, handler: Handler) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key) || [];
    handlers.push(handler);
    this.subscribers.set(key, handlers);
    this.trackedObjectKeys.set(key, objectKey);

    const cached = this.cachedItems.get(key);
    if (cached) {
      this.notifyUpdated(objectKey, cached.state);
      return;
    }

    this.queueItem(objectKey);

    this.scheduleGetTaskState();
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    const index = findIndex(handlers, h => h === handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.subscribers.delete(key);
      this.trackedObjectKeys.delete(key);
    } else {
      this.subscribers.set(key, handlers);
    }
  }

  getTaskState(keys: ObjectKey[]) {
    const options: RequestServiceOptions = {
      path: 'tasks/state',
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          taskKeys: keys,
        }),
      },
    };

    return utils.requestService<BaseItem<TaskState>[]>(
      this.serviceConfig,
      options,
    );
  }

  notifyUpdated(objectKey: ObjectKey, state: TaskState | DecisionState) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    handlers.forEach(handler => {
      handler(state);
    });
  }

  private queueAllItems() {
    this.batchedKeys = new Map(this.trackedObjectKeys);
  }

  private queueItem(objectKey: ObjectKey) {
    const key = objectKeyToString(objectKey);
    if (this.batchedKeys.get(key)) {
      return;
    }

    this.batchedKeys.set(key, objectKey);
  }

  private dequeueItem(objectKey: ObjectKey) {
    const key = objectKeyToString(objectKey);
    this.batchedKeys.delete(key);
  }

  private scheduleGetTaskState() {
    if (this.debouncedTaskStateQuery) {
      clearTimeout(this.debouncedTaskStateQuery);
    }

    this.debouncedTaskStateQuery = setTimeout(() => {
      this.getTaskState(Array.from(this.batchedKeys.values())).then(tasks => {
        tasks.forEach(task => {
          const { containerAri, objectAri, localId } = task;
          const objectKey = { containerAri, objectAri, localId };
          this.cachedItems.set(objectKeyToString(objectKey), task);

          this.dequeueItem(objectKey);
          this.notifyUpdated(objectKey, task.state);
        });
      });
    }, 1);
  }
}

export default class TaskDecisionResource implements TaskDecisionProvider {
  private serviceConfig: TaskDecisionResourceConfig;
  private recentUpdates = new RecentUpdates();
  private itemStateManager: ItemStateManager;

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.serviceConfig = serviceConfig;
    this.itemStateManager = new ItemStateManager(serviceConfig);
  }

  getDecisions(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<DecisionResponse> {
    return this.query(
      query,
      'decisions/query',
      convertServiceDecisionResponseToDecisionResponse,
      recentUpdatesListener,
    );
  }

  getTasks(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<TaskResponse> {
    return this.query(
      query,
      'tasks/query',
      convertServiceTaskResponseToTaskResponse,
      recentUpdatesListener,
    );
  }

  getItems(
    query: Query,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<ItemResponse> {
    return this.query(
      query,
      'elements/query',
      convertServiceItemResponseToItemResponse,
      recentUpdatesListener,
    );
  }

  unsubscribeRecentUpdates(id: RecentUpdatesId) {
    this.recentUpdates.unsubscribe(id);
  }

  notifyRecentUpdates(recentUpdateContext: RecentUpdateContext) {
    this.recentUpdates.notify(recentUpdateContext);
    this.itemStateManager.refreshAllTasks();
  }

  private query<S, R>(
    query: Query,
    path: string,
    converter: ResponseConverter<S, R>,
    recentUpdatesListener?: RecentUpdatesListener,
  ): Promise<R> {
    const options: RequestServiceOptions = {
      path,
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(this.apiQueryToServiceQuery(query)),
      },
    };
    if (recentUpdatesListener) {
      this.recentUpdates.subscribe(query.containerAri, recentUpdatesListener);
    }
    return utils
      .requestService<S>(this.serviceConfig, options)
      .then(serviceResponse => {
        return converter(serviceResponse, query);
      });
  }

  private apiQueryToServiceQuery(query: Query) {
    const { sortCriteria, limit, ...other } = query;
    const serviceQuery: any = {
      ...other,
      limit: limit || defaultLimit,
    };
    switch (sortCriteria) {
      case 'lastUpdateDate':
        serviceQuery.sortCriteria = 'LAST_UPDATE_DATE';
        break;
      case 'creationDate':
      default:
        serviceQuery.sortCriteria = 'CREATION_DATE';
        break;
    }
    return serviceQuery;
  }

  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState> {
    return this.itemStateManager.toggleTask(objectKey, state);
  }

  subscribe(objectKey: ObjectKey, handler: Handler) {
    this.itemStateManager.subscribe(objectKey, handler);
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler) {
    this.itemStateManager.unsubscribe(objectKey, handler);
  }

  /**
   * Usually only needed for testing to ensure no outstanding requests
   * are sent to a server (typically mocked).
   */
  destroy() {
    this.itemStateManager.destroy();
  }

  getCurrentUser(): User | undefined {
    return this.serviceConfig.currentUser;
  }
}
