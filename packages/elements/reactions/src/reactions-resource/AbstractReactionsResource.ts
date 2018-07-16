import { findIndex, equalEmojiId } from '../internal/helpers';
import {
  ReactionsProvider,
  Reactions,
  Listener,
  ObjectReactionKey,
  ReactionSummary,
  SubscriptionHandler,
  ReactionsState,
  ReactionStatus,
} from './types';

export type UpdaterFunction<T> = (state: Readonly<T>) => T;
export type Updater<T> = T | UpdaterFunction<T>;

const getNewValue = <T>(updater: Updater<T>) => (previousValue: T): T => {
  if (updater instanceof Function) {
    return updater(previousValue);
  }
  return updater;
};

export default abstract class AbstractReactionsResource
  implements ReactionsProvider {
  protected excludeArisFromAutoPoll: string[] = [];
  protected cachedReactions: {
    readonly [key: string]: ReactionsState;
  } = {};
  protected subscribers: { [ari: string]: Listener[] } = {};
  protected lastActionForAri: { [ari: string]: number } = {};

  private batchedKeys: ObjectReactionKey[] = [];
  private debounced: number | null = null;

  private loadingStatus: ReactionsState = {
    status: ReactionStatus.loading,
  };

  private errorStatus: ReactionsState = {
    status: ReactionStatus.error,
    message: 'Error while fetching reactions',
  };

  protected autoPoll(autoPollInterval) {
    if (!autoPollInterval) {
      return;
    }

    setTimeout(() => {
      const aris = Object.keys(this.subscribers);

      if (aris.length) {
        const subscriptionKeys = aris.map(ari => {
          const tokens = ari.split('|');
          return {
            ari: tokens[1],
            containerAri: tokens[0],
          };
        });
        this.getReactions(subscriptionKeys).then(reactions => {
          Object.keys(reactions).forEach(ari => {
            this.includeAriInAutoPoll(ari);
            this.notifyUpdated(reactions[ari][0].containerAri, ari, {
              status: ReactionStatus.ready,
              reactions: reactions[ari],
            });
          });
          this.autoPoll(autoPollInterval);
        });
      } else {
        this.autoPoll(autoPollInterval);
      }
    }, autoPollInterval);
  }

  private findReaction(
    key: string,
    emojiId: string,
  ): ReactionSummary | undefined {
    const reactionState = this.cachedReactions[key];
    const index = this.findReactionIndex(reactionState, emojiId);
    return index !== -1 &&
      reactionState &&
      reactionState.status === ReactionStatus.ready
      ? reactionState.reactions[index]
      : undefined;
  }

  protected findReactionIndex(
    reactionsState: ReactionsState,
    emojiId: string,
  ): number {
    if (reactionsState && reactionsState.status === ReactionStatus.ready) {
      return reactionsState.reactions.findIndex(reaction =>
        equalEmojiId(reaction.emojiId, emojiId),
      );
    }
    return -1;
  }

  private hasReacted(key: string, emojiId: string) {
    const reaction = this.findReaction(key, emojiId);
    return reaction && reaction.reacted;
  }

  toggleReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    objectCreationTimestamp?: number,
  ): Promise<ReactionsState> {
    const key = `${containerAri}|${ari}`;

    if (this.hasReacted(key, emojiId)) {
      return this.deleteReaction(containerAri, ari, emojiId).catch(e => {
        this.optimisticAddReaction(containerAri, ari, emojiId);
        throw e;
      });
    } else {
      return this.addReaction(
        containerAri,
        ari,
        emojiId,
        objectCreationTimestamp,
      ).catch(e => {
        this.optimisticDeleteReaction(containerAri, ari, emojiId);
        throw e;
      });
    }
  }

  notifyUpdated(
    containerAri: string,
    ari: string,
    state: Readonly<ReactionsState>,
  ): void {
    const key = this.objectReactionKey(containerAri, ari);
    if (!this.subscribers[key]) {
      return;
    }

    this.subscribers[key].forEach(listener => {
      listener.handler(state);
    });
  }

  objectReactionKeyToString(key: ObjectReactionKey): string {
    return this.objectReactionKey(key.containerAri, key.ari);
  }

  objectReactionKey(containerAri: string, ari: string): string {
    return `${containerAri}|${ari}`;
  }

  subscribe(
    subscriptionKey: ObjectReactionKey,
    handler: SubscriptionHandler,
  ): void {
    let key = this.objectReactionKeyToString(subscriptionKey);
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }

    this.subscribers[key].push({ handler });
    this.notifyUpdated(
      subscriptionKey.containerAri,
      subscriptionKey.ari,
      this.loadingStatus,
    );

    if (this.debounced) {
      clearTimeout(this.debounced);
    }

    this.queueAri(subscriptionKey);

    this.debounced = setTimeout(() => {
      this.getReactions(this.batchedKeys)
        .then(reactions => {
          Object.keys(reactions).forEach(key => {
            const objectReactions = reactions[key];
            const containerAri = subscriptionKey.containerAri;
            const ari = key;
            this.dequeueAri({
              ari: ari,
              containerAri: containerAri,
            });
            this.updateReactionState(containerAri, ari, {
              status: ReactionStatus.ready,
              reactions: objectReactions,
            });
          });
        })
        .catch(() => {
          this.batchedKeys.forEach(key => {
            this.notifyUpdated(key.containerAri, key.ari, this.errorStatus);
          });
        });
    }, 1);
  }

  unsubscribe(subscriptionKey: ObjectReactionKey, handler: Function): void {
    let key = this.objectReactionKeyToString(subscriptionKey);
    if (!this.subscribers[key]) {
      return;
    }

    const index = findIndex(
      this.subscribers[key],
      (listener: Listener) => listener.handler === handler,
    );

    if (index !== -1) {
      this.subscribers[key].splice(index, 1);
    }
  }

  private queueAri(subscriptionKey: ObjectReactionKey): void {
    const index = findIndex(
      this.batchedKeys,
      i =>
        i.ari === subscriptionKey.ari &&
        i.containerAri === subscriptionKey.containerAri,
    );
    if (index === -1) {
      this.batchedKeys.push(subscriptionKey);
    }
  }

  private dequeueAri(subscriptionKey: ObjectReactionKey): void {
    const index = findIndex(
      this.batchedKeys,
      i =>
        i.ari === subscriptionKey.ari &&
        i.containerAri === subscriptionKey.containerAri,
    );
    if (index !== -1) {
      this.batchedKeys.splice(index, 1);
    }
  }

  private excludeAriFromAutoPoll(ari): void {
    if (this.excludeArisFromAutoPoll.indexOf(ari) === -1) {
      this.excludeArisFromAutoPoll.push(ari);
    }
  }

  private includeAriInAutoPoll(ari): void {
    const index = this.excludeArisFromAutoPoll.indexOf(ari);
    if (index === -1) {
      return;
    }
    this.excludeArisFromAutoPoll.splice(index, 1);
  }

  protected optimisticAddReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): void {
    this.updateEmojiState(containerAri, ari, emojiId, reaction => ({
      ...reaction,
      count: reaction.count + 1,
      reacted: true,
      optimisticallyUpdated: true,
    }));
  }

  protected optimisticDeleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): void {
    this.updateEmojiState(containerAri, ari, emojiId, reaction => ({
      ...reaction,
      count: reaction.count - 1,
      reacted: false,
      optimisticallyUpdated: true,
    }));
  }

  protected updateEmojiState(
    containerAri: string,
    ari: string,
    emojiId: string,
    updater: Updater<ReactionSummary>,
  ): ReactionsState {
    return this.updateReactionState(containerAri, ari, reactionsState => {
      if (reactionsState.status === ReactionStatus.ready) {
        let found = false;
        let changed = false;
        const reactions = reactionsState.reactions.map(reaction => {
          if (reaction.emojiId === emojiId) {
            found = true;
            const newReaction = getNewValue(updater)(reaction);
            if (reaction !== newReaction) {
              changed = true;
            }
            return newReaction;
          }
          return reaction;
        });
        if (!found) {
          const reaction = {
            containerAri,
            ari,
            emojiId,
            count: 0,
            reacted: false,
            optimisticallyUpdated: false,
          };
          const newReaction = getNewValue(updater)(reaction);
          if (newReaction !== reaction) {
            reactions.push(newReaction);
            changed = true;
          }
        }
        if (changed) {
          return {
            ...reactionsState,
            reactions: reactions.filter(value => value.count > 0),
          };
        }
      }
      return reactionsState;
    });
  }

  protected updateReactionState(
    containerAri: string,
    ari: string,
    updater: Updater<ReactionsState>,
  ): ReactionsState {
    this.excludeAriFromAutoPoll(ari);
    const key = this.objectReactionKey(containerAri, ari);

    const previousState: ReactionsState = this.cachedReactions[key] || {
      status: ReactionStatus.ready,
      reactions: [],
    };

    this.cachedReactions = {
      ...this.cachedReactions,
      [key]: getNewValue(updater)(previousState),
    };

    if (previousState !== this.cachedReactions[key]) {
      this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
    }
    return this.cachedReactions[key];
  }

  abstract addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    objectCreationTimestamp?: number,
  ): Promise<ReactionsState>;

  abstract deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState>;

  abstract getReactions(keys: ObjectReactionKey[]): Promise<Reactions>;

  abstract getDetailedReaction(
    reaction: ReactionSummary,
  ): Promise<ReactionSummary>;

  abstract fetchReactionDetails(
    reaction: ReactionSummary,
  ): Promise<ReactionSummary>;
}
