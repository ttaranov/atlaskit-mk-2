import axios from 'axios';

const tokenCache = {};
const accessUrns = {
  MediaServicesSample: {
    'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
  },
  'mediapicker-test': {
    'urn:filestore:collection': ['create'],
    'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
  },
};

export const mediaPickerAuthProvider = component => context => {
  const collectionName = context && context.collectionName;
  const authEnvironment =
    component.state.authEnvironment === 'asap' ? 'asap' : '';
  const cacheKey = `${collectionName}:${authEnvironment}`;

  if (tokenCache[cacheKey]) {
    return Promise.resolve(tokenCache[cacheKey]);
  } else {
    const url = `https://media-playground.dev.atl-paas.net/token/tenant?environment=${authEnvironment}`;
    const body = JSON.stringify({
      access: accessUrns[collectionName],
    };
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Accept', 'text/plain, */*; q=0.01');

    return axios(url, {
      method: 'POST',
      data: body,
      headers: headers,
      withCredentials: true,
    })
      .then(r => r.data)
      .then(data => {
        tokenCache[cacheKey] = data;

        return tokenCache[cacheKey];
      });
  }
};

export const defaultMediaPickerAuthProvider = () => {
  const auth = {
    clientId: 'a89be2a1-f91f-485c-9962-a8fb25ccfa13',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhODliZTJhMS1mOTFmLTQ4NWMtOTk2Mi1hOGZiMjVjY2ZhMTMiLCJ1bnNhZmUiOnRydWUsImlhdCI6MTQ3MzIyNTEzNn0.6Isj5jKgKzWDnPqfoMLiC_LVIlGM8kg_wxG6eGGwhTw',
  };

  return Promise.resolve(auth);
};
