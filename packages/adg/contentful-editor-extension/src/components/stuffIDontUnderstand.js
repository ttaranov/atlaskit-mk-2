require('babel-core/register');
require('babel-polyfill');
import { Context, ContextFactory } from '@atlaskit/media-core';
import { StoryBookAuthProvider } from '@atlaskit/media-test-helpers';

const defaultCollectionName = 'MediaServicesSample';
const defaultServiceHost = 'https://dt-api.dev.atl-paas.net';
const userAuthProviderBaseURL = 'https://dt-api.dev.atl-paas.net';

const accessUrns = {
  MediaServicesSample: {
    'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
    'urn:filestore:file': ['create'],
    'urn:filestore:file:*': ['read', 'update'],
  },
  'mediapicker-test': {
    'urn:filestore:collection': ['create'],
    'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
    'urn:filestore:file': ['create'],
    'urn:filestore:file:*': ['read', 'update'],
  },
};

async function requestAuthProvider(authEnvironment, collectionName) {
  const url = `https://api-private.dev.atlassian.com/media-playground/api/token/tenant?environment=${authEnvironment}`;
  const body = JSON.stringify({
    access: accessUrns[collectionName],
  });
  const headers = new Headers();

  headers.append('Content-Type', 'application/json; charset=utf-8');
  headers.append('Accept', 'text/plain, */*; q=0.01');

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
    credentials: 'include',
  });

  return response.json();
}

const mediaPickerAuthProvider = (authEnvironment = 'asap') => context => {
  const collectionName =
    (context && context.collectionName) || 'MediaServicesSample';
  authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
  const cacheKey = `${collectionName}:${authEnvironment}`;

  if (!cachedAuths[cacheKey]) {
    cachedAuths[cacheKey] = requestAuthProvider(
      authEnvironment,
      collectionName,
    );
  }
  return cachedAuths[cacheKey];
};

let userAuthProviderPromiseCache;

const userAuthProvider = () => {
  if (userAuthProviderPromiseCache) {
    return userAuthProviderPromiseCache;
  }

  const url =
    'https://api-private.dev.atlassian.com/media-playground/api/token/user/impersonation';

  userAuthProviderPromiseCache = fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(({ clientId, token }) => {
      return {
        clientId,
        token,
      };
    });
  return userAuthProviderPromiseCache;
};

function storyMediaProviderFactory2(mediaProviderFactoryConfig = {}) {
  const {
    collectionName,
    stateManager,
    includeUploadContext,
    includeLinkCreateContext,
    includeUserAuthProvider,
  } = mediaProviderFactoryConfig;
  const collection = collectionName || defaultCollectionName;
  const context = ContextFactory.create({
    serviceHost: userAuthProviderBaseURL,
    authProvider: mediaPickerAuthProvider(),
    userAuthProvider:
      includeUserAuthProvider === false ? undefined : userAuthProvider,
  });

  return Promise.resolve({
    featureFlags: {
      useNewUploadService: true,
    },
    stateManager,
    uploadParams: { collection },
    viewContext: Promise.resolve(context),
    uploadContext:
      includeUploadContext === false ? undefined : Promise.resolve(context),
    linkCreateContext: !includeLinkCreateContext
      ? undefined
      : Promise.resolve(
          ContextFactory.create({
            serviceHost: defaultServiceHost,
            authProvider: StoryBookAuthProvider.create(false, {
              [`urn:filestore:collection:${collection}`]: ['read', 'update'],
              'urn:filestore:file:*': ['read'],
              'urn:filestore:chunk:*': ['read'],
            }),
          }),
        ),
  });
}

const pendingPromise = new Promise(function() {});

export const providers = {
  mediaProvider: {
    resolved: storyMediaProviderFactory2(),
    pending: pendingPromise,

    'view only': storyMediaProviderFactory2({
      includeUploadContext: false,
    }),
    'with link cards': storyMediaProviderFactory2({
      includeLinkCreateContext: true,
    }),
    'w/o userAuthProvider': storyMediaProviderFactory2({
      includeUserAuthProvider: false,
    }),
    undefined: undefined,
  },
};
