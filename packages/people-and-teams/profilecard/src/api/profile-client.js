// @flow
import { LRUCache } from 'lru-fast';

import { type AkProfileClientConfig } from '../types';

/**
 * Transform presence response to atlaskit/avatar compatible presence value
 * @param presenceResponse
 * @returns {string}
 */
const calculatePresence = presenceResponse => {
  if (!presenceResponse) {
    return null;
  }

  let state = presenceResponse.state;
  const stateMetadata = presenceResponse.stateMetadata
    ? JSON.parse(presenceResponse.stateMetadata)
    : null;

  if (state === 'busy') {
    if (stateMetadata && stateMetadata.focus) {
      state = 'focus';
    }
  }
  return state;
};

/**
 * Transform response from GraphQL
 * - Prefix `timestring` with `remoteWeekdayString` depending on `remoteWeekdayIndex`
 * - Remove properties which will be not used later
 * @ignore
 * @param  {object} response
 * @return {object}
 */
export const modifyResponse = (response: any) => {
  const presence = calculatePresence(response.Presence);
  const data = {
    ...response.User,
    presence,
    presenceMessage: response.Presence && response.Presence.message,
  };

  const localWeekdayIndex = new Date().getDay().toString();

  if (
    data.remoteWeekdayIndex &&
    data.remoteWeekdayIndex !== localWeekdayIndex
  ) {
    data.remoteTimeString = `${data.remoteWeekdayString} ${
      data.remoteTimeString
    }`;
  }

  data.timestring = data.remoteTimeString;

  delete data.remoteWeekdayIndex;
  delete data.remoteWeekdayString;
  delete data.remoteTimeString;
  delete data.id;

  return data;
};

const buildHeaders = () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  return headers;
};

/**
 * @param  {string} userId
 * @param  {string} cloudId
 * @return {string} GraphQL Query String
 */
const buildUserQuery = (cloudId: string, userId: string) => ({
  query: `query User($userId: String!, $cloudId: String!) {
    User: CloudUser(userId: $userId, cloudId: $cloudId) {
      id,
      isCurrentUser,
      isActive: active,
      isBot,
      isNotMentionable,
      fullName,
      nickname,
      email,
      meta: title,
      location,
      avatarUrl(size: 192),
      remoteWeekdayIndex: localTime(format: "d"),
      remoteWeekdayString: localTime(format: "ddd"),
      remoteTimeString: localTime(format: "h:mma"),
    }
    Presence: Presence(organizationId: $cloudId, userId: $userId) {
      state,
      type,
      date,
      stateMetadata,
      message
    }
  }`,
  variables: {
    cloudId,
    userId,
  },
});

/**
 * @param {string} serviceUrl - GraphQL service endpoint
 * @param {string} userId
 * @param {string} cloudId
 */
const requestService = (serviceUrl, cloudId, userId): Promise<any> => {
  const headers = buildHeaders();
  const userQuery = buildUserQuery(cloudId, userId);

  return fetch(
    new Request(serviceUrl, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers,
      body: JSON.stringify(userQuery),
    }),
  ).then(response => {
    if (!response.ok) {
      return Promise.reject({
        code: response.status,
        reason: response.statusText,
      });
    }

    return response.json().then(json => {
      if (json.errors) {
        return Promise.reject({
          reason: json.errors[0].category || 'default',
        });
      }

      return modifyResponse(json.data);
    });
  });
};

class ProfileClient {
  config: AkProfileClientConfig;
  cache: any;

  constructor(config: AkProfileClientConfig) {
    const defaults = {
      cacheSize: 10,
      cacheMaxAge: 0,
    };

    this.config = { ...defaults, ...config };
    // never set cacheSize or cacheMaxAge to negative numbers
    this.config.cacheSize = Math.max(parseInt(this.config.cacheSize, 10), 0);
    this.config.cacheMaxAge = Math.max(
      parseInt(this.config.cacheMaxAge, 10),
      0,
    );
    // DIR-474: cap cache at 30 days.
    if (this.config.cacheMaxAge) {
      this.config.cacheMaxAge = Math.min(
        this.config.cacheMaxAge,
        30 * 24 * 60 * 60 * 1000,
      );
    }
    // Only set cache if maxCacheAge and cacheSize are set
    this.cache =
      !this.config.cacheMaxAge || !this.config.cacheSize
        ? null
        : new LRUCache(this.config.cacheSize);
  }

  makeRequest(cloudId: string, userId: string) {
    if (!this.config.url) {
      throw new Error('config.url is a required parameter');
    }

    return requestService(this.config.url, cloudId, userId);
  }

  setCachedProfile(cloudId: string, userId: string, cacheItem: any) {
    const cacheIdentifier = `${cloudId}/${userId}`;
    this.cache.put(cacheIdentifier, cacheItem);
  }

  getCachedProfile(cloudId: string, userId: string) {
    const cacheIdentifier = `${cloudId}/${userId}`;

    const cached = this.cache && this.cache.get(cacheIdentifier);

    if (!cached) {
      return null;
    }

    if (cached.expire < Date.now()) {
      this.cache.remove(cacheIdentifier);
      return null;
    }

    this.cache.set(cacheIdentifier, {
      expire: Date.now() + this.config.cacheMaxAge,
      profile: cached.profile,
    });

    return cached.profile;
  }

  flushCache() {
    if (this.cache) {
      this.cache.removeAll();
    }
  }

  getProfile(cloudId: string, userId: string): Promise<any> {
    if (!cloudId || !userId) {
      return Promise.reject(new Error('cloudId or userId missing'));
    }

    const cache = this.getCachedProfile(cloudId, userId);

    if (cache) {
      return Promise.resolve(cache);
    }

    return new Promise((resolve: Function, reject: Function) => {
      this.makeRequest(cloudId, userId)
        .then((data: any) => {
          if (this.cache) {
            this.setCachedProfile(cloudId, userId, {
              expire: Date.now() + this.config.cacheMaxAge,
              profile: data,
            });
          }
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}

export default ProfileClient;
