import { ContextFactory } from '@atlaskit/media-core';
import { createPromise } from '../cross-platform-promise';

function getToken() {
  return createPromise<any>('getAuth').submit();
}

function createMediaProvider() {
  return getToken().then(data => {
    const { baseUrl, clientId, collectionName, token } = data;
    const createMediaContext = Promise.resolve(
      ContextFactory.create({
        authProvider: () =>
          Promise.resolve({
            baseUrl,
            clientId,
            token,
          }),
      }),
    );

    return {
      uploadContext: createMediaContext,
      viewContext: createMediaContext,
      uploadParams: {
        collection: collectionName,
      },
    };
  });
}

export default Promise.resolve(createMediaProvider());
