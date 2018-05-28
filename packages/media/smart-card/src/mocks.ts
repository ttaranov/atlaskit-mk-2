import mock from 'xhr-mock';

const resolveUrl =
  'https://api-private.stg.atlassian.com/object-resolver/resolve';

const context = '';

const serviceAuth = {
  key: 'default',
  displayName: 'Google Drive',
  url:
    'https://id.stg.internal.atlassian.com/outboundAuth/start?containerId=e3e9e187-1d64-4812-a522-e4069a46fab8&serviceKey=default&redirectUrl=http%3A%2F%2Flocalhost%3A8081%2Fapps%2Foutbound-auth%2Ffinish',
};

const generator = {
  name: 'Google Drive',
  icon:
    'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
};

const resolvedBody = {
  meta: {
    visibility: 'restricted',
    access: 'granted',
    auth: [serviceAuth],
  },
  data: {
    '@context': context,
    generator,
    name: 'Getting Started',
  },
};

const unauthorisedBody = {
  meta: {
    visibility: 'restricted',
    access: 'unauthorised',
    auth: [serviceAuth],
  },
  data: {
    '@context': context,
    generator,
  },
};

const forbiddenBody = {
  meta: {
    visibility: 'restricted',
    access: 'forbidden',
    auth: [serviceAuth],
  },
  data: {
    '@context': context,
    generator,
  },
};

const flowResponsesByUrl = {
  'public-happy': [
    {
      status: 200,
      body: resolvedBody,
    },
  ],
  'private-happy': [
    {
      status: 200,
      body: unauthorisedBody,
    },
    {
      status: 200,
      body: resolvedBody,
    },
  ],
  'private-forbidden': [
    {
      status: 200,
      body: unauthorisedBody,
    },
    {
      status: 200,
      body: forbiddenBody,
    },
  ],
  'not-found': [
    {
      status: 404,
    },
  ],
  error: [
    {
      status: 500,
    },
  ],
};

const flowIndiciesByUrl = {};

mock.setup();

mock.post(`${resolveUrl}`, (req, res) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const url = JSON.parse(req.body()).resourceUrl;
      const response =
        flowResponsesByUrl[url] &&
        flowResponsesByUrl[url][flowIndiciesByUrl[url] || 0];
      if (response) {
        flowIndiciesByUrl[url] = (flowIndiciesByUrl[url] || 0) + 1;
        if (flowIndiciesByUrl[url] >= flowResponsesByUrl[url].length) {
          flowIndiciesByUrl[url] = 0;
        }
        if (response.status) res.status(response.status);
        if (response.headers) res.headers(response.headers);
        if (response.body) res.body(JSON.stringify(response.body));
        resolve(res);
      } else {
        res.status(404);
        resolve(res);
      }
    }, 900);
  });
});
