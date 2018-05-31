import {
  getServiceDecisionsResponse,
  getServiceItemsResponse,
  getServiceTasksResponse,
  participants,
} from './story-data';
import { findIndex, objectKeyToString, toggleTaskState } from './utils';
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
  TaskDecisionProvider,
  TaskResponse,
  TaskState,
  User,
  convertServiceItemResponseToItemResponse,
  convertServiceDecisionResponseToDecisionResponse,
  convertServiceTaskResponseToTaskResponse,
  ReminderTime,
  HandlerType,
} from '@atlaskit/task-decision';

import * as subMinutes from 'date-fns/sub_minutes';

export interface MockTaskDecisionResourceConfig {
  hasMore?: boolean;
  lag?: number;
  error?: boolean;
  empty?: boolean;
}

let debouncedTaskStateQuery: number | null = null;
let debouncedDecisionStateQuery: number | null = null;
let debouncedTaskToggle: number | null = null;

interface BaseResult {
  nextQuery?: Query;
}

export class MockTaskDecisionResource implements TaskDecisionProvider {
  private config?: MockTaskDecisionResourceConfig;
  private fakeCursor = 0;
  private lastNewItemTime = new Date();
  private subscribers: Map<string, Handler<any>[]> = new Map();
  private cachedItems: Map<
    string,
    BaseItem<TaskState | DecisionState>
  > = new Map();
  private batchedKeys: Map<string, ObjectKey> = new Map();

  constructor(config?: MockTaskDecisionResourceConfig) {
    this.config = config;
    this.subscribers.clear();
    this.cachedItems.clear();
    this.batchedKeys.clear();
  }

  getDecisions(query: Query): Promise<DecisionResponse> {
    if (this.config) {
      if (this.config.empty) {
        return Promise.resolve({
          decisions: [],
        });
      }
      if (this.config.error) {
        return Promise.reject('error');
      }
    }
    const serviceDecisionResponse = getServiceDecisionsResponse();
    const result = convertServiceDecisionResponseToDecisionResponse(
      serviceDecisionResponse,
    );
    return this.applyConfig(query, result, 'decisions');
  }

  getTasks(query: Query): Promise<TaskResponse> {
    if (this.config) {
      if (this.config.empty) {
        return Promise.resolve({
          tasks: [],
        });
      }
      if (this.config.error) {
        return Promise.reject('error');
      }
    }
    const serviceTasksResponse = getServiceTasksResponse();
    const result = convertServiceTaskResponseToTaskResponse(
      serviceTasksResponse,
    );
    return this.applyConfig(query, result, 'tasks');
  }

  getItems(query: Query): Promise<ItemResponse> {
    if (this.config) {
      if (this.config.empty) {
        return Promise.resolve({
          items: [],
        });
      }
      if (this.config.error) {
        return Promise.reject('error');
      }
    }
    const serviceItemResponse = getServiceItemsResponse();
    const result = convertServiceItemResponseToItemResponse(
      serviceItemResponse,
    );
    return this.applyConfig(query, result, 'items');
  }

  unsubscribeRecentUpdates(id: RecentUpdatesId) {}

  notifyRecentUpdates(updateContext?: RecentUpdateContext) {}

  private getNextDate() {
    // Random 15 minute chunk earlier
    this.lastNewItemTime = subMinutes(
      this.lastNewItemTime,
      Math.random() * 50 * 15,
    );
    return this.lastNewItemTime;
  }

  private applyConfig<R extends BaseResult>(
    query: Query,
    result: R,
    itemKey: string,
  ): Promise<R> {
    let nextQuery: Query | undefined;
    if (this.config && this.config.hasMore) {
      nextQuery = {
        ...query,
        cursor: `${++this.fakeCursor}`,
      };
    }
    const newResult: R = {
      [itemKey]: result[itemKey].map(item => {
        const itemDate = this.getNextDate();
        return {
          ...item,
          creationDate: itemDate,
          lastUpdateDate: itemDate,
          localId: `${item.localId}-${this.fakeCursor}`,
        };
      }),
      nextQuery,
    } as R;

    const lag = this.config && this.config.lag;

    if (lag) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(newResult);
        }, lag);
      });
    }
    return Promise.resolve(newResult);
  }

  getDecisionState(keys: ObjectKey[]): Promise<BaseItem<DecisionState>[]> {
    return Promise.resolve([
      {
        containerAri:
          'ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/12e445f8-478c-4902-a556-f4866b273033',
        objectAri:
          'ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003',
        localId: 'd1',
        state: 'DECIDED',
        type: 'DECISION',
        reminderDate: '2018-05-30T02:40:07.106Z',
      } as BaseItem<DecisionState>,
    ]);
  }

  getTaskState(keys: ObjectKey[]): Promise<BaseItem<TaskState>[]> {
    return Promise.resolve([
      {
        containerAri:
          'ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/12e445f8-478c-4902-a556-f4866b273033',
        objectAri:
          'ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003',
        localId: 'bff0c423-3bba-45c4-a310-d49f7a95003e',
        state: 'DONE',
        type: 'TASK',
        reminderDate: '2018-05-30T02:40:07.106Z',
      } as BaseItem<TaskState>,
    ]);
  }

  toggleTask(
    baseItem: BaseItem<TaskState>,
    state: TaskState,
  ): Promise<TaskState> {
    if (debouncedTaskToggle) {
      clearTimeout(debouncedTaskToggle);
    }
    const objectKey: ObjectKey = {
      localId: baseItem.localId,
      containerAri: baseItem.containerAri,
      objectAri: baseItem.objectAri,
    };

    // Optimistically notify subscribers that the task have been updated so that they can re-render accordingly
    this.notifyUpdatedState(objectKey, state);

    return new Promise<TaskState>(resolve => {
      const key = objectKeyToString(objectKey);
      const cached = this.cachedItems.get(key);
      if (cached) {
        cached.state = state;
        this.cachedItems.set(key, cached);
      } else {
        this.cachedItems.set(key, {
          ...baseItem,
          state,
        } as BaseItem<DecisionState | TaskState>);
      }

      resolve(state);

      const lag = (this.config && this.config.lag) || 0;
      setTimeout(() => {
        if (this.config && this.config.error) {
          // Undo optimistic change
          this.notifyUpdatedState(objectKey, toggleTaskState(state));
        } else {
          this.notifyUpdatedState(objectKey, state);
        }
      }, 500 + lag);
    });
  }

  subscribe(objectKey: ObjectKey, handler: Handler<any>) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key) || [];
    handlers.push(handler);
    this.subscribers.set(key, handlers);

    const cached = this.cachedItems.get(key);
    if (cached) {
      this.notifyUpdatedState(objectKey, cached.state);
      this.notifyUpdatedReminderDate(objectKey, cached.reminderDate);
      return;
    }

    if (debouncedTaskStateQuery) {
      clearTimeout(debouncedTaskStateQuery);
    }

    if (debouncedDecisionStateQuery) {
      clearTimeout(debouncedDecisionStateQuery);
    }

    this.queueItem(objectKey);

    debouncedTaskStateQuery = setTimeout(() => {
      this.getTaskState(Array.from(this.batchedKeys.values())).then(tasks => {
        tasks.forEach(task => {
          const { containerAri, objectAri, localId } = task;
          const objectKey = { containerAri, objectAri, localId };
          this.cachedItems.set(objectKeyToString(objectKey), task);

          this.dequeueItem(objectKey);
          this.notifyUpdatedState(objectKey, task.state);
          this.notifyUpdatedReminderDate(objectKey, task.reminderDate);
        });
      });
    }, 1);

    debouncedDecisionStateQuery = setTimeout(() => {
      this.getDecisionState(Array.from(this.batchedKeys.values())).then(
        tasks => {
          tasks.forEach(task => {
            const { containerAri, objectAri, localId } = task;
            const objectKey = { containerAri, objectAri, localId };
            this.cachedItems.set(objectKeyToString(objectKey), task);

            this.dequeueItem(objectKey);
            this.notifyUpdatedState(objectKey, task.state);
            this.notifyUpdatedReminderDate(objectKey, task.reminderDate);
          });
        },
      );
    }, 1);
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
    } else {
      this.subscribers.set(key, handlers);
    }
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

  notifyUpdatedReminderDate(objectKey: ObjectKey, reminderDate?: ReminderTime) {
    const key = objectKeyToString(objectKey);
    const handlers = this.subscribers.get(key);
    if (!handlers) {
      return;
    }

    handlers.forEach(handler => {
      if (handler.type === HandlerType.REMINDER) {
        handler.callback(reminderDate);
      }
    });
  }

  getCurrentUser(): User | undefined {
    // Return a random user or undefined from the participants list
    const randomParticipant = Math.floor(Math.random() * participants.length);
    return Math.random() < 0.75 ? participants[randomParticipant] : undefined;
  }

  updateReminderDate(
    baseItem: BaseItem<TaskState | DecisionState>,
    reminderDate: ReminderTime,
  ): Promise<ReminderTime> {
    const objectKey: ObjectKey = {
      localId: baseItem.localId,
      containerAri: baseItem.containerAri,
      objectAri: baseItem.objectAri,
    };
    // Optimistically notify subscribers that the timestamp has updated so that they can re-render accordingly
    this.notifyUpdatedReminderDate(objectKey, reminderDate);

    return new Promise<ReminderTime>(resolve => {
      const key = objectKeyToString(objectKey);
      const cached = this.cachedItems.get(key);
      const previousTimestamp = baseItem.reminderDate;
      if (cached) {
        this.cachedItems.set(key, {
          ...cached,
          reminderDate,
        });
      } else {
        this.cachedItems.set(key, {
          ...baseItem,
          reminderDate,
        } as BaseItem<DecisionState | TaskState>);
      }

      resolve(reminderDate);

      const lag = (this.config && this.config.lag) || 0;
      setTimeout(() => {
        if (this.config && this.config.error) {
          // Undo optimistic change
          this.notifyUpdatedReminderDate(objectKey, previousTimestamp);
        } else {
          this.notifyUpdatedReminderDate(objectKey, reminderDate);
        }
      }, 500 + lag);
    });
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
}
