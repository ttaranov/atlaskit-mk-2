// @flow
import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import { LRUCache } from 'lru-fast';

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
export const modifyResponse = response => {
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

  data.isCensored = data.isCensored !== 'visible';

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
const buildUserQuery = (cloudId, userId) => ({
  query: `query User($userId: String!, $cloudId: String!) {
    User: CloudUser(userId: $userId, cloudId: $cloudId) {
      id,
      isCurrentUser,
      isCensored: censoredStatus,
      isActive: active,
      isBot,
      isNotMentionable,
      fullName,
      nickname,
      email,
      meta: title,
      location,
      companyName,
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
const requestService = (serviceUrl, cloudId, userId) => {
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
  /**
   * @param {object} config
   * @param {string} config.url
   * @param {string} [config.cacheSize=10]
   * @param {string} [config.cacheMaxAge=null]
   */
  constructor(config) {
    const defaults = {
      cacheSize: 10,
      cacheMaxAge: null,
    };

    this.config = { ...defaults, ...config };
    // Set maxCacheAge only if it's a positive number
    this.cacheMaxAge =
      Math.max(parseInt(this.config.cacheMaxAge, 10), 0) || null;
    // DIR-474: cap cache at 30 days.
    if (this.cacheMaxAge) {
      this.cacheMaxAge = Math.min(this.cacheMaxAge, 30 * 24 * 60 * 60 * 1000);
    }
    // Only set cache if maxCacheAge is set
    this.cache =
      this.cacheMaxAge === null ? null : new LRUCache(this.config.cacheSize);
  }

  makeRequest(cloudId, userId) {
    if (!this.config.url) {
      throw new Error('config.url is a required parameter');
    }

    return requestService(this.config.url, cloudId, userId);
  }

  setCachedProfile(cloudId, userId, cacheItem) {
    const cacheIdentifier = `${cloudId}/${userId}`;
    this.cache.put(cacheIdentifier, cacheItem);
  }

  getCachedProfile(cloudId, userId) {
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
      expire: Date.now() + this.cacheMaxAge,
      profile: cached.profile,
    });

    return cached.profile;
  }

  flushCache() {
    if (this.cache) {
      this.cache.removeAll();
    }
  }

  getProfile(cloudId, userId) {
    if (!cloudId || !userId) {
      return Promise.reject(new Error('cloudId or userId missing'));
    }

    const cache = this.getCachedProfile(cloudId, userId);

    if (cache) {
      return Promise.resolve(cache);
    }

    return new Promise((resolve, reject) => {
      this.makeRequest(cloudId, userId)
        .then(data => {
          if (this.cache) {
            this.setCachedProfile(cloudId, userId, {
              expire: Date.now() + this.cacheMaxAge,
              profile: data,
            });
          }
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default ProfileClient;
