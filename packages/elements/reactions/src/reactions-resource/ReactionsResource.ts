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

type ReactionsResponse = { ari: string; reactions: ReactionSummary[] };

const requestService = <T>(baseUrl: string, path: string, opts?: {}) => {
  const url = `${baseUrl}/${path}`;
  const options = opts;

  return new Promise<T>((resolve, reject) => {
    fetch(url, options)
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

  private generateLocalActionId(ari: string): number {
    const localId = (this.lastActionForAri[ari] || 0) + 1;
    this.lastActionForAri[ari] = localId;
    return localId;
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
        this.updateEmojiState(containerAri, ari, emojiId, emojiState => {
          if (emojiState.count === 0 || emojiState.optimisticallyUpdated) {
            return emojiState;
          } else {
            return reactionDetails;
          }
        });
        delete this.inFlightDetailsRequests[reactionId];
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
          this.updateReactionState(containerAri, ari, {
            status: ReactionStatus.ready,
            reactions: reactions[ari],
          });
        });
        resolve(reactions);
      });
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    objectCreationTimestamp?: number,
  ): Promise<ReactionsState> {
    analyticsService.trackEvent('reactions.add.reaction', {
      containerAri,
      ari,
      emojiId,
    });
    this.optimisticAddReaction(containerAri, ari, emojiId);

    const localActionId = this.generateLocalActionId(ari);

    return requestService<{ ari: string; reactions: ReactionSummary[] }>(
      this.config.baseUrl,
      'reactions',
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          emojiId,
          ari,
          containerAri,
          objectCreationTimestamp,
        }),
        credentials: 'include',
      },
    ).then(this.updateState(containerAri, localActionId));
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

    const localActionId = this.generateLocalActionId(ari);

    return requestService<ReactionsResponse>(
      this.config.baseUrl,
      `reactions?ari=${ari}&emojiId=${emojiId}&containerAri=${containerAri}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      },
    ).then(this.updateState(containerAri, localActionId));
  }

  private updateState = (containerAri: string, localActionId: number) => ({
    ari,
    reactions,
  }: ReactionsResponse): ReactionsState =>
    this.updateReactionState(containerAri, ari, reactionsState => {
      // Do not update cache if it was already updated by a more recent action
      if (this.lastActionForAri[ari] === localActionId) {
        return {
          status: ReactionStatus.ready,
          reactions,
        };
      }
      return reactionsState;
    });
}
