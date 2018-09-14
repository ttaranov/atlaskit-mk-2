// import mock, { delay, proxy } from 'xhr-mock';
import * as fm from 'fetch-mock';

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
  icon: {
    url:
      'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
  },
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

let cntr = 0;
fm.mock('*', (_, opts: any) => {
  const { resourceUrl } = JSON.parse(opts.body);
  if (resourceUrl === 'private-happy') {
    cntr++;
    if (cntr > 8) {
      return resolvedBody;
    }
    if (cntr > 4) {
      return forbiddenBody;
    }
    return unauthorisedBody;
  }
  return unauthorisedBody;
});
