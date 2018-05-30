import * as uuid from 'uuid';
import { RequestServiceOptions, utils } from '@atlaskit/util-service-support';
import {
  PubSubSpecialEventType,
  PubSubClient,
  ReminderTime,
  HandlerType,
} from '../types';
import { defaultLimit } from '../constants';

import {
  convertServiceDecisionResponseToDecisionResponse,
  convertServiceItemResponseToItemResponse,
  convertServiceTaskResponseToTaskResponse,
  convertServiceTaskToTask,
  convertServiceTaskStateToBaseItem,
  findIndex,
  ResponseConverter,
} from './TaskDecisionUtils';

import {
  BaseItem,
  ServiceTaskState,
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
  ServiceItem,
} from '../types';

import {
  objectKeyToString,
  toggleTaskState,
  toObjectKey,
} from '../type-helpers';

interface RecentUpdateByIdValue {
  listener: RecentUpdatesListener;
  containerAri: string;
}

export const ACTION_CREATED_FPS_EVENT =
  'avi:task-decision-service:created:action';
export const ACTION_EDITED_FPS_EVENT =
  'avi:task-decision-service:edited:action';
export const ACTION_DELETED_FPS_EVENT =
  'avi:task-decision-service:deleted:action';
export const ACTION_ARCHIVED_FPS_EVENT =
  'avi:task-decision-service:archived:action';
export const ACTION_STATE_CHANGED_FPS_EVENT =
  'avi:task-decision-service:stateChanged:action';

export const DECISION_CREATED_FPS_EVENT =
  'avi:task-decision-service:created:decision';
export const DECISION_EDITED_FPS_EVENT =
  'avi:task-decision-service:edited:decision';
export const DECISION_DELETED_FPS_EVENT =
  'avi:task-decision-service:deleted:decision';
export const DECISION_ARCHIVED_FPS_EVENT =
  'avi:task-decision-service:archived:decision';
export const DECISION_STATE_CHANGED_FPS_EVENT =
  'avi:task-decision-service:stateChanged:decision';

export const ACTION_DECISION_FPS_EVENTS = 'avi:task-decision-service:*:*';

export class RecentUpdates {
  private idsByContainer: Map<string, string[]> = new Map();
  private listenersById: Map<string, RecentUpdateByIdValue> = new Map();

  private pubSubClient?: PubSubClient;

  constructor(pubSubClient?: PubSubClient) {
    this.pubSubClient = pubSubClient;
    this.subscribeToPubSubEvents();
  }

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

  onPubSubEvent = (event, payload: ServiceItem) => {
    const { containerAri } = payload;
    this.notify({ containerAri });
  };

  destroy() {
    this.unsubscribeFromPubSubEvents();
  }

  private subscribeToPubSubEvents() {
    if (this.pubSubClient) {
      this.pubSubClient.on(ACTION_DECISION_FPS_EVENTS, this.onPubSubEvent);
    }
  }

  private unsubscribeFromPubSubEvents() {
    if (this.pubSubClient) {
      this.pubSubClient.off(ACTION_DECISION_FPS_EVENTS, this.onPubSubEvent);
    }
  }
}

export class ItemStateManager {
  private debouncedTaskStateQuery: number | null = null;
  private debouncedTaskToggle: Map<string, number> = new Map();
  private serviceConfig: TaskDecisionResourceConfig;
  private subscribers: Map<string, Handler<any>[]> = new Map();
  private trackedObjectKeys: Map<string, ObjectKey> = new Map();
  private cachedItems: Map<
    string,
    BaseItem<TaskState | DecisionState>
  > = new Map();
  private batchedKeys: Map<string, ObjectKey> = new Map();

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.serviceConfig = serviceConfig;
    this.subscribeToPubSubEvents();
  }

  destroy() {
    if (this.debouncedTaskStateQuery) {
      clearTimeout(this.debouncedTaskStateQuery);
    }

    this.debouncedTaskToggle.forEach(timeout => {
      clearTimeout(timeout);
    });

    this.unsubscribeFromPubSubEvents();
  }

  toggleTask(
    baseItem: BaseItem<TaskState>,
    state: TaskState,
  ): Promise<TaskState> {
    const objectKey = toObjectKey(baseItem);
    const stringKey = objectKeyToString(objectKey);
    const timeout = this.debouncedTaskToggle.get(stringKey);
    if (timeout) {
      clearTimeout(timeout);
      this.debouncedTaskToggle.delete(stringKey);
    }

    // Update cache optimistically
    this.cachedItems.set(stringKey, {
      ...baseItem,
      state,
    });

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdatedState(objectKey, state);

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
              this.notifyUpdatedState(objectKey, state);
            })
            .catch(() => {
              // Undo optimistic change
              const previousState = toggleTaskState(state);
              this.cachedItems.set(stringKey, {
                ...baseItem,
                state: previousState,
              });

              this.notifyUpdatedState(objectKey, previousState);
              reject();
            });
        }, 500),
      );
    });
  }

  /**
   * TODO: Innovation week spike
   */
  updateReminderDate(
    baseItem: BaseItem<TaskState | DecisionState>,
    reminderDate: ReminderTime,
  ): Promise<ReminderTime> {
    const objectKey = toObjectKey(baseItem);
    const stringKey = objectKeyToString(objectKey);
    const previousTimestamp = baseItem.reminderDate;

    // Update cache optimistically
    this.cachedItems.set(stringKey, {
      ...baseItem,
      reminderDate,
    });

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdatedReminderDate(objectKey, reminderDate);

    /**
     * TODO: Make REST call to service
     */
    return new Promise<ReminderTime>((resolve, reject) => {
      const options: RequestServiceOptions = {
        path: 'tasks/reminder',
        requestInit: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            ...objectKey,
            reminderDate,
          }),
        },
      };
      utils
        .requestService<ServiceTask>(this.serviceConfig, options)
        .then(convertServiceTaskToTask)
        .then(task => {
          const key = objectKeyToString(objectKey);
          this.cachedItems.set(key, task);

          resolve(reminderDate);
          // Notify subscribers that the task have been updated so that they can re-render accordingly
          this.notifyUpdatedReminderDate(objectKey, task.reminderDate);
        })
        .catch(() => {
          // Undo optimistic change
          this.cachedItems.set(stringKey, {
            ...baseItem,
            reminderDate: previousTimestamp,
          });
          reject();
          this.notifyUpdatedReminderDate(objectKey, previousTimestamp);
        });
    });
  }

  refreshAllTasks() {
    this.queueAllItems();
    this.scheduleGetTaskState();
  }

  subscribe(objectKey: ObjectKey, handler: Handler<any>) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key) || [];
    handlers.push(handler);
    this.subscribers.set(key, handlers);
    this.trackedObjectKeys.set(key, objectKey);

    const cached = this.cachedItems.get(key);
    if (cached) {
      this.notifyUpdatedState(objectKey, cached.state);
      this.notifyUpdatedReminderDate(objectKey, cached.reminderDate);
      return;
    }

    this.queueItem(objectKey);

    this.scheduleGetTaskState();
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler<any>) {
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

    return utils.requestService<ServiceTaskState[]>(
      this.serviceConfig,
      options,
    );
  }

  notifyUpdatedState(objectKey: ObjectKey, state: TaskState | DecisionState) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    handlers.forEach(handler => {
      if (handler.type === HandlerType.STATE) {
        handler.callback(state);
      }
    });
  }

  notifyUpdatedReminderDate(objectKey: ObjectKey, timestamp?: ReminderTime) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    handlers.forEach(handler => {
      if (handler.type === HandlerType.REMINDER) {
        handler.callback(timestamp);
      }
    });
  }

  onTaskUpdatedEvent = (event, payload: ServiceTask) => {
    const { containerAri, objectAri, localId } = payload;
    const objectKey = { containerAri, objectAri, localId };

    const key = objectKeyToString(objectKey);

    const cached = this.cachedItems.get(key);
    if (!cached) {
      // ignore unknown task
      return;
    }

    const lastUpdateDate = new Date(payload.lastUpdateDate);
    if (lastUpdateDate > cached.lastUpdateDate) {
      this.cachedItems.set(key, convertServiceTaskStateToBaseItem(payload));
      this.notifyUpdatedState(objectKey, payload.state);
      this.notifyUpdatedReminderDate(objectKey, payload.reminderDate);
      return;
    }
  };

  onReconnect = () => {
    this.refreshAllTasks();
  };

  private subscribeToPubSubEvents() {
    if (this.serviceConfig.pubSubClient) {
      this.serviceConfig.pubSubClient.on(
        ACTION_STATE_CHANGED_FPS_EVENT,
        this.onTaskUpdatedEvent,
      );
      this.serviceConfig.pubSubClient.on(
        PubSubSpecialEventType.RECONNECT,
        this.onReconnect,
      );
    }
  }

  private unsubscribeFromPubSubEvents() {
    if (this.serviceConfig.pubSubClient) {
      this.serviceConfig.pubSubClient.off(
        ACTION_STATE_CHANGED_FPS_EVENT,
        this.onTaskUpdatedEvent,
      );
      this.serviceConfig.pubSubClient.off(
        PubSubSpecialEventType.RECONNECT,
        this.onReconnect,
      );
    }
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
          const baseItem = convertServiceTaskStateToBaseItem(task);
          this.cachedItems.set(objectKeyToString(objectKey), baseItem);

          this.dequeueItem(objectKey);
          this.notifyUpdatedState(objectKey, task.state);
          this.notifyUpdatedReminderDate(objectKey, task.reminderDate);
        });
      });
    }, 1);
  }
}

export default class TaskDecisionResource implements TaskDecisionProvider {
  private serviceConfig: TaskDecisionResourceConfig;
  private recentUpdates: RecentUpdates;
  private itemStateManager: ItemStateManager;

  constructor(serviceConfig: TaskDecisionResourceConfig) {
    this.serviceConfig = serviceConfig;
    this.recentUpdates = new RecentUpdates(serviceConfig.pubSubClient);
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

  toggleTask(
    baseItem: BaseItem<TaskState>,
    state: TaskState,
  ): Promise<TaskState> {
    return this.itemStateManager.toggleTask(baseItem, state);
  }

  updateReminderDate(
    baseItem: BaseItem<TaskState | DecisionState>,
    reminderDate: ReminderTime,
  ): Promise<ReminderTime> {
    return this.itemStateManager.updateReminderDate(baseItem, reminderDate);
  }

  subscribe(objectKey: ObjectKey, handler: Handler<any>) {
    this.itemStateManager.subscribe(objectKey, handler);
  }

  unsubscribe(objectKey: ObjectKey, handler: Handler<any>) {
    this.itemStateManager.unsubscribe(objectKey, handler);
  }

  /**
   * Usually only needed for testing to ensure no outstanding requests
   * are sent to a server (typically mocked).
   */
  destroy() {
    this.recentUpdates.destroy();
    this.itemStateManager.destroy();
  }

  getCurrentUser(): User | undefined {
    return this.serviceConfig.currentUser;
  }
}
