import { findIndex, equalEmojiId } from '../internal/helpers';
import {
  ReactionsProvider,
  Reactions,
  Listener,
  ObjectReactionKey,
  ReactionSummary,
  SubscriptionHandler,
  ReactionsState,
} from './types';

export default abstract class AbstractReactionsResource
  implements ReactionsProvider {
  protected excludeArisFromAutoPoll: string[] = [];
  protected cachedReactions: {
    [key: string]: ReactionsState;
  } = {};
  protected subscribers: { [ari: string]: Listener[] } = {};
  protected lastActionForAri: { [ari: string]: number } = {};

  private batchedKeys: ObjectReactionKey[] = [];
  private debounced: number | null = null;

  private loadingStatus: ReactionsState = {
    status: 'loading',
  };

  private errorStatus: ReactionsState = {
    status: 'error',
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
              status: 'ready',
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
    if (reactionState && reactionState.status === 'ready') {
      return reactionState.reactions.find(reaction =>
        equalEmojiId(reaction.emojiId, emojiId),
      );
    }
    return undefined;
  }

  private hasReacted(key: string, emojiId: string) {
    const reaction = this.findReaction(key, emojiId);
    return reaction && reaction.reacted;
  }

  toggleReaction(containerAri: string, ari: string, emojiId: string) {
    const key = `${containerAri}|${ari}`;

    if (this.hasReacted(key, emojiId)) {
      this.deleteReaction(containerAri, ari, emojiId)
        .then(state => {
          this.notifyUpdated(containerAri, ari, state);
        })
        .catch(() => {
          this.optimisticAddReaction(containerAri, ari, emojiId);
          this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
        });
    } else {
      this.addReaction(containerAri, ari, emojiId)
        .then(state => {
          this.notifyUpdated(containerAri, ari, state);
        })
        .catch(() => {
          this.optimisticDeleteReaction(containerAri, ari, emojiId);
          this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
        });
    }
  }

  notifyUpdated(
    containerAri: string,
    ari: string,
    state: ReactionsState,
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
            let objectReactions = reactions[key];
            const containerAri = subscriptionKey.containerAri;
            const ari = key;
            this.dequeueAri({
              ari: ari,
              containerAri: containerAri,
            });
            this.notifyUpdated(containerAri, ari, {
              status: 'ready',
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
    const key = this.objectReactionKey(containerAri, ari);
    this.excludeAriFromAutoPoll(ari);

    if (!this.cachedReactions[key]) {
      this.cachedReactions[key] = {
        status: 'ready',
        reactions: [],
      };
    }

    const reactionState = this.cachedReactions[key];
    const reaction = this.findReaction(key, emojiId);
    if (reaction) {
      reaction.reacted = true;
      reaction.count++;
    } else if (reactionState.status === 'ready') {
      reactionState.reactions.push({
        ari: ari,
        containerAri: containerAri,
        emojiId: emojiId,
        count: 1,
        reacted: true,
      });
    }

    this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
  }

  protected optimisticDeleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): void {
    const key = this.objectReactionKey(containerAri, ari);
    this.excludeAriFromAutoPoll(ari);

    const reaction = this.findReaction(key, emojiId);

    if (reaction) {
      reaction.reacted = false;
      reaction.count--;

      if (reaction.count < 1) {
        const reactionState = this.cachedReactions[key];
        if (reactionState.status === 'ready') {
          reactionState.reactions = reactionState.reactions.filter(
            r => r !== reaction,
          );
        }
      }

      this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
    }
  }

  abstract addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
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
