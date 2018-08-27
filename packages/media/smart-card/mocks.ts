import mock, { delay, proxy } from 'xhr-mock';

const resolveUrl =
  'https://api-private.stg.atlassian.com/object-resolver/resolve';

const context = '';
const definitionId = 'google-drive';

const serviceAuth = {
  key: 'default',
  displayName: 'Google',
  url:
    'https://outbound-auth-flow.ap-southeast-2.dev.atl-paas.net/start?containerId=f4d9cdf9-9977-4c40-a4d2-968a4986ade0&serviceKey=default',
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
    definitionId,
  },
  data: {
    '@context': context,
    generator,
    name: 'URL A',
  },
};

const unauthorisedBody = {
  meta: {
    visibility: 'restricted',
    access: 'unauthorized',
    auth: [serviceAuth],
    definitionId,
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
    definitionId,
  },
  data: {
    '@context': context,
    generator,
  },
};

const notFoundBody = {
  meta: {
    visibility: 'not_found',
    access: 'forbidden',
    auth: [serviceAuth],
    definitionId,
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
  'private-happy-b': [
    {
      status: 200,
      body: unauthorisedBody,
    },
    {
      status: 200,
      body: {
        ...resolvedBody,
        data: {
          ...resolvedBody.data,
          name: 'URL B',
        },
      },
    },
  ],
  'private-happy-c': [
    {
      status: 200,
      body: unauthorisedBody,
    },
    {
      status: 200,
      body: {
        ...resolvedBody,
        data: {
          ...resolvedBody.data,
          name: 'URL C',
        },
      },
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
      status: 200,
      body: notFoundBody,
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

mock.post(
  `${resolveUrl}`,
  delay((req, res) => {
    const url = JSON.parse(req.body()).resourceUrl;
    const response =
      (flowResponsesByUrl as any)[url] &&
      (flowResponsesByUrl as any)[url][(flowIndiciesByUrl as any)[url] || 0];
    if (response) {
      (flowIndiciesByUrl as any)[url] =
        ((flowIndiciesByUrl as any)[url] || 0) + 1;
      if (
        (flowIndiciesByUrl as any)[url] >=
        (flowResponsesByUrl as any)[url].length
      ) {
        (flowIndiciesByUrl as any)[url] = 0;
      }
      if (response.status) res.status(response.status);
      if (response.headers) res.headers(response.headers);
      if (response.body) res.body(JSON.stringify(response.body));
      return res;
    } else {
      return undefined;
    }
  }, 900),
);

mock.use(proxy);
