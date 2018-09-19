import * as fm from 'fetch-mock';

const context = '';
const googleDefinitionId = 'google';
const trelloDefinitionId = 'trello';

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

const resolvedBody = (definitionId: string, name: string) => ({
  meta: {
    visibility: 'restricted',
    access: 'granted',
    auth: [serviceAuth],
    definitionId,
  },
  data: {
    '@context': context,
    generator,
    name,
  },
});

const notFoundBody = (definitionId: string) => ({
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
});

const unauthorisedBody = (definitionId: string) => ({
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
});

const forbiddenBody = (definitionId: string) => ({
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
});

const delayP = (n: number) => new Promise(res => setTimeout(res, n));

export const mockMultipleCards = () => {
  let c1 = 0;
  let c2 = 0;
  fm.mock('*', async (_, opts: any) => {
    await delayP(1000);

    const resourceUrl = JSON.parse(opts.body).resourceUrl;

    if (resourceUrl.startsWith('google')) {
      c1++;
      const step = Math.floor((c1 - 1) / 5);
      if (step === 0) {
        return;
      }
      if (step === 1) {
        return unauthorisedBody(googleDefinitionId);
      }
      if (step === 2) {
        return;
      }
      if (step === 3) {
        return forbiddenBody(googleDefinitionId);
      }
      return resolvedBody(googleDefinitionId, resourceUrl);
    }

    if (resourceUrl.startsWith('trello')) {
      switch (++c2) {
        case 1:
          return unauthorisedBody(trelloDefinitionId);
        case 2:
          return forbiddenBody(trelloDefinitionId);
        default:
          return resolvedBody(trelloDefinitionId, resourceUrl);
      }
    }

    throw new Error('Unkonws request type');
  });
};

export const mockSingleCardWorkflow = () => {
  let c = 0;
  fm.mock(
    'https://api-private.stg.atlassian.com/object-resolver/resolve',
    () => {
      return delayP(10000).then(() => {
        switch (++c) {
          case 1:
            return unauthorisedBody;
          case 2:
            return forbiddenBody;
          default:
            return resolvedBody;
        }
      });
    },
  );
};
