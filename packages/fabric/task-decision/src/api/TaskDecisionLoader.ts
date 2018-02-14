import {
  Decision,
  Item,
  Query,
  RecentUpdateContext,
  Task,
  TaskDecisionProvider,
} from '../types';

/**
 * Grabs the latest Items from the service, deduplicating against existing items.
 */
export const loadLatestItems = (
  query: Query,
  existing: Item[],
  provider: TaskDecisionProvider,
  recentUpdateContext: RecentUpdateContext,
): Promise<Item[]> => {
  if (recentUpdateContext.localId) {
    // Retry until localId is found
    return retryIteration(
      () => provider.getItems(query).then(r => r.items),
      recentUpdateContext,
    ).then(items => mergeItems(existing, items));
  }
  // Just load
  return provider
    .getItems(query)
    .then(response => mergeItems(existing, response.items));
};

/**
 * Grabs the latest Decisions from the service, deduplicating against existing Decisions.
 */
export const loadLatestDecisions = (
  query: Query,
  existing: Decision[],
  provider: TaskDecisionProvider,
): Promise<Decision[]> => {
  return provider
    .getDecisions(query)
    .then(response => mergeItems(existing, response.decisions));
};

/**
 * Grabs the latest Tasks from the service, deduplicating against existing Tasks.
 */
export const loadLatestTasks = (
  query: Query,
  existing: Task[],
  provider: TaskDecisionProvider,
): Promise<Task[]> => {
  return provider
    .getTasks(query)
    .then(response => mergeItems(existing, response.tasks));
};

export interface ItemLoader<T> {
  (): Promise<T[]>;
}

const retryDelaysInMilliseconds = [
  500,
  1000,
  1500,
  2500,
  4000,
  6000,
  8000,
  10000,
];

export const retryIteration = <T extends Item>(
  loader: ItemLoader<T>,
  recentUpdateContext: RecentUpdateContext,
  retry: number = 0,
): Promise<T[]> => {
  return loadWithDelay(loader, retryDelaysInMilliseconds[retry]).then(items => {
    if (
      items.filter(item => item.localId === recentUpdateContext.localId)
        .length > 0
    ) {
      return items;
    }
    const delay = retryDelaysInMilliseconds[retry || 0];
    if (!delay) {
      // Give up - just retry what we've got.
      return items;
    }
    return retryIteration(loader, recentUpdateContext, retry + 1);
  });
};

export const loadWithDelay = <T>(
  loader: ItemLoader<T>,
  delay: number,
): Promise<T[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      loader().then(items => {
        resolve(items);
      });
    }, delay);
  });
};

export interface ItemLike {
  localId: string;
}

export const mergeItems = <I extends ItemLike>(
  existingItems: I[],
  newItems: I[],
): I[] => {
  const newIds = new Set(newItems.map(item => item.localId));
  const unchangedItems = existingItems.filter(
    item => !newIds.has(item.localId),
  );
  return [...newItems, ...unchangedItems];
};
