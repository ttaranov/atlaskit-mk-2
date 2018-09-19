import * as fm from 'fetch-mock';

const context = 'Document';
const googleDefinitionId = 'google';
const trelloDefinitionId = 'trello';
const dropboxDefinitionId = 'dropbox';

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
    '@type': ['Document'],
    '@context': context,
    generator,
    name,
    updated: '2018-07-19T03:34:07.930Z',
    updatedBy: {
      '@type': 'Person',
      name: 'Artur Bodera',
    },
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
  let c3 = 0;
  fm.mock('*', async (_, opts: any) => {
    await delayP(1000);

    const resourceUrl = JSON.parse(opts.body).resourceUrl;

    if (resourceUrl.startsWith('google')) {
      c1++;
      if (c1 >= 0 && c1 <= 6) {
        console.log('MOCK:\tgoogle:\terror', c1);
        return;
      }
      if (c1 >= 7 && c1 <= 11) {
        console.log('MOCK:\tgoogle:\tunauthorisedBody', c1);
        return unauthorisedBody(googleDefinitionId);
      }
      if (c1 >= 12 && c1 <= 16) {
        console.log('MOCK:\tgoogle:\terror', c1);
        return;
      }
      if (c1 >= 17 && c1 <= 21) {
        console.log('MOCK:\tgoogle:\tforbiddenBody', c1);
        return forbiddenBody(googleDefinitionId);
      }
      console.log('MOCK:\tgoogle:\tresolvedBody', c1);
      return resolvedBody(googleDefinitionId, resourceUrl);
    }

    if (resourceUrl.startsWith('trello')) {
      switch (++c2) {
        case 1: {
          console.log('MOCK:\ttrello:\tunauthorisedBody');
          return unauthorisedBody(trelloDefinitionId);
        }
        case 2: {
          console.log('MOCK:\ttrello:\tforbiddenBody');
          return forbiddenBody(trelloDefinitionId);
        }
        default: {
          console.log('MOCK:\ttrello:\tresolvedBody');
          return resolvedBody(trelloDefinitionId, resourceUrl);
        }
      }
    }

    if (resourceUrl.startsWith('dropbox')) {
      switch (++c3) {
        case 1: {
          console.log('MOCK:\tdropbox:\terror');
          return;
        }
        case 2: {
          console.log('MOCK:\tdropbox:\tunauthorisedBody');
          return unauthorisedBody(dropboxDefinitionId);
        }
        case 3: {
          console.log('MOCK:\tdropbox:\terror');
          return;
        }
        case 4: {
          console.log('MOCK:\tdropbox:\tforbiddenBody');
          return forbiddenBody(dropboxDefinitionId);
        }
        case 5: {
          console.log('MOCK:\tdropbox:\tforbiddenBody');
          return forbiddenBody(dropboxDefinitionId);
        }
        default: {
          console.log('MOCK:\tdropbox:\tresolvedBody');
          return resolvedBody(dropboxDefinitionId, resourceUrl);
        }
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
