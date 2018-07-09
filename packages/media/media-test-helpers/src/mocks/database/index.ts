import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaStore, MediaCollection } from '@atlaskit/media-store';
import { Database } from 'kakapo';
import * as uuid from 'uuid';

import { getFakeFileName, fakeImage } from './mockData';
import { mapDataUriToBlob } from '../../utils';
import { createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';
import { createUpload, Upload } from './upload';
import { Chunk } from './chunk';
import { defaultServiceHost } from '../..';

export * from './collection';
export * from './collection-item';

export const tenantAuth: ClientBasedAuth = {
  clientId: uuid.v4(),
  token: 'some-tenant-token',
};

export const userAuth: ClientBasedAuth = {
  clientId: uuid.v4(),
  token: 'some-user-token',
};

export const userAuthProvider = () => Promise.resolve(userAuth);
export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

export type DatabaseSchema = {
  collection: MediaCollection;
  collectionItem: CollectionItem;
  upload: Upload;
  chunk: Chunk;
};

export function createDatabase(): Database<DatabaseSchema> {
  const database = new Database<DatabaseSchema>();

  database.register('collectionItem', createCollectionItem);
  database.register('collection', createCollection);
  database.register('upload', createUpload);
  database.register('chunk');

  return database;
}

export function generateUserData(): void {
  const mediaStore = new MediaStore({
    serviceHost: defaultServiceHost,
    authProvider: userAuthProvider,
  });

  const image = mapDataUriToBlob(fakeImage);
  mediaStore.createCollection('recents');

  for (let i = 0; i < 10; i++) {
    mediaStore.createFileFromBinary(image, {
      name: getFakeFileName(),
      collection: 'recents',
      occurrenceKey: uuid.v4(),
    });
  }
}

export function generateTenantData(): void {
  const mediaStore = new MediaStore({
    serviceHost: defaultServiceHost,
    authProvider: tenantAuthProvider,
  });

  mediaStore.createCollection('MediaServicesSample');
}
