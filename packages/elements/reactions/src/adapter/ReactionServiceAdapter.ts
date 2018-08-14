import { ReactionAdapter } from './ReactionAdapter';
import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';

type ReactionsResponse = { ari: string; reactions: ReactionSummary[] };

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

export class ReactionServiceAdapter implements ReactionAdapter {
  private baseUrl: string;
  private sessionToken?: string;
  constructor(baseUrl: string, sessionToken?: string) {
    this.baseUrl = baseUrl;
    this.sessionToken = sessionToken;
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    if (this.sessionToken) {
      headers.append('Authorization', this.sessionToken);
    }
    return headers;
  }

  getReactions(containerAri: string, aris: string[]): Promise<Reactions> {
    if (aris.length === 0) {
      return Promise.resolve({});
    }
    return requestService<Reactions>(this.baseUrl, 'reactions/view', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ containerAri, aris }),
      credentials: 'include',
    });
  }

  getDetailedReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary> {
    const reactionId = `${containerAri}|${ari}|${emojiId}`;
    const headers = this.getHeaders();
    headers.delete('Content-Type');
    return requestService<ReactionSummary>(
      this.baseUrl,
      `reactions?reactionId=${encodeURIComponent(reactionId)}`,
      {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      },
    );
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    return requestService<ReactionsResponse>(this.baseUrl, 'reactions', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ emojiId, ari, containerAri }),
      credentials: 'include',
    }).then(({ reactions }) => reactions);
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    return requestService<ReactionsResponse>(
      this.baseUrl,
      `reactions?ari=${ari}&emojiId=${emojiId}&containerAri=${containerAri}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      },
    ).then(({ reactions }) => reactions);
  }
}
