import { findIndex, updateReadonlyArray } from '../internal/helpers';
import { analyticsService } from '../analytics';
import {
  ReactionsProvider,
  ReactionSummary,
  ObjectReactionKey,
  Reactions,
  ReactionsState,
  ReactionStatus,
} from './types';
import AbstractReactionsResource from './AbstractReactionsResource';

export interface ReactionsProviderConfig {
  sessionToken?: string;
  baseUrl: string;
  autoPoll?: number;
}

const requestService = <T>(baseUrl: string, path: string, opts?: {}) => {
  const url = `${baseUrl}/${path}`;
  const options = opts;

  return new Promise<T>((resolve, reject) => {
    fetch(new Request(url, options))
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject({
            code: response.status,
            reason: response.statusText,
          });
        }
      })
      .catch(reject);
  });
};

export default class ReactionsResource extends AbstractReactionsResource
  implements ReactionsProvider {
  private inFlightDetailsRequests = {};

  constructor(private config: ReactionsProviderConfig) {
    super();

    if (config.autoPoll) {
      this.autoPoll(config.autoPoll);
    }
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    if (this.config.sessionToken) {
      headers.append('Authorization', this.config.sessionToken);
    }
    return headers;
  }

  getDetailedReaction(reaction: ReactionSummary): Promise<ReactionSummary> {
    const { containerAri, ari, emojiId } = reaction;
    analyticsService.trackEvent('reactions.detailed.reaction', {
      containerAri,
      ari,
      emojiId,
    });
    const reactionId = `${containerAri}|${ari}|${emojiId}`;
    const headers = this.getHeaders();
    headers.delete('Content-Type');
    return requestService<ReactionSummary>(
      this.config.baseUrl,
      `reactions?reactionId=${encodeURIComponent(reactionId)}`,
      {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      },
    );
  }

  fetchReactionDetails(reaction: ReactionSummary): Promise<ReactionSummary> {
    const { containerAri, ari, emojiId } = reaction;
    analyticsService.trackEvent('reactions.detailed.reaction', {
      containerAri,
      ari,
      emojiId,
    });
    const reactionId = `${containerAri}|${ari}|${emojiId}`;

    if (!this.inFlightDetailsRequests[reactionId]) {
      this.inFlightDetailsRequests[reactionId] = this.getDetailedReaction(
        reaction,
      ).then(reactionDetails => {
        const { containerAri, ari, emojiId } = reactionDetails;
        const key = this.objectReactionKey(containerAri, ari);
        if (!this.cachedReactions[key]) {
          this.cachedReactions = {
            ...this.cachedReactions,
            [key]: {
              status: ReactionStatus.ready,
              reactions: [],
            },
          };
        }

        const state = this.cachedReactions[key];
        if (state.status === ReactionStatus.ready) {
          const reactionIndex = findIndex(
            state.reactions,
            r => r.emojiId === emojiId,
          );
          if (reactionIndex !== -1) {
            const existingReaction = state.reactions[reactionIndex];
            if (!existingReaction.optimisticallyUpdated) {
              state.reactions = updateReadonlyArray(
                state.reactions,
                reactionIndex,
                _ => reactionDetails,
              );

              this.notifyUpdated(containerAri, ari, state);
            }
          }

          delete this.inFlightDetailsRequests[reactionId];
        }
        return reactionDetails;
      }, () => delete this.inFlightDetailsRequests[reactionId]);
    }

    return this.inFlightDetailsRequests[reactionId];
  }

  getReactions(keys: ObjectReactionKey[]): Promise<Reactions> {
    if (keys.length === 0) {
      return Promise.resolve({});
    }
    const aris = keys.map(key => key.ari);
    const containerAri = keys[0].containerAri;
    return new Promise<Reactions>((resolve, reject) => {
      requestService<Reactions>(this.config.baseUrl, 'reactions/view', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          containerAri: containerAri,
          aris,
        }),
        credentials: 'include',
      }).then(reactions => {
        Object.keys(reactions).forEach(ari => {
          const cacheKey = this.objectReactionKey(containerAri, ari);
          this.cachedReactions = {
            ...this.cachedReactions,
            [cacheKey]: {
              status: ReactionStatus.ready,
              reactions: reactions[ari],
            },
          };
        });
        resolve(reactions);
      });
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    analyticsService.trackEvent('reactions.add.reaction', {
      containerAri,
      ari,
      emojiId,
    });
    this.optimisticAddReaction(containerAri, ari, emojiId);

    const timestamp = Date.now();
    this.lastActionForAri[ari] = timestamp;

    return new Promise<ReactionsState>((resolve, reject) => {
      requestService<{ ari: string; reactions: ReactionSummary[] }>(
        this.config.baseUrl,
        'reactions',
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ emojiId, ari, containerAri }),
          credentials: 'include',
        },
      )
        .then(reactions => {
          const key = this.objectReactionKey(containerAri, ari);
          // Do not update cache if it was already updated by a more recent action
          if (this.lastActionForAri[ari] === timestamp) {
            this.cachedReactions = {
              ...this.cachedReactions,
              [key]: {
                status: ReactionStatus.ready,
                reactions: reactions.reactions,
              },
            };
          }

          resolve(this.cachedReactions[key]);
        })
        .catch(() => reject());
    });
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    analyticsService.trackEvent('reactions.delete.reaction', {
      containerAri,
      ari,
      emojiId,
    });
    this.optimisticDeleteReaction(containerAri, ari, emojiId);

    const timestamp = Date.now();
    this.lastActionForAri[ari] = timestamp;

    return new Promise<ReactionsState>((resolve, reject) => {
      requestService<{ ari: string; reactions: ReactionSummary[] }>(
        this.config.baseUrl,
        `reactions?ari=${ari}&emojiId=${emojiId}&containerAri=${containerAri}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
          credentials: 'include',
        },
      )
        .then(reactions => {
          const key = this.objectReactionKey(containerAri, ari);
          // Do not update cache if it was already updated by a more recent action
          if (this.lastActionForAri[ari] === timestamp) {
            this.cachedReactions = {
              ...this.cachedReactions,
              [key]: {
                status: ReactionStatus.ready,
                reactions: reactions.reactions,
              },
            };
          }

          resolve(this.cachedReactions[key]);
        })
        .catch(() => reject());
    });
  }
}
