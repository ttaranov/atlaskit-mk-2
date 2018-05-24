import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaStore } from '@atlaskit/media-store';
import { Database } from 'kakapo';
import Faker = require('faker');

import { mapDataUriToBlob } from '../../utils';
import { Collection, createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';

export * from './collection';
export * from './collection-item';

export const serviceHost = 'https://dt-api.dev.atl-paas.net';

export const tenantAuth: ClientBasedAuth = {
  clientId: Faker.random.uuid(),
  token: 'some-tenant-token',
};

export const userAuth: ClientBasedAuth = {
  clientId: Faker.random.uuid(),
  token: 'some-user-token',
};

export const userAuthProvider = () => Promise.resolve(userAuth);
export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

export type DatabaseSchema = {
  collection: Collection;
  collectionItem: CollectionItem;
};

export function createDatabase(): Database<DatabaseSchema> {
  const database = new Database<DatabaseSchema>();

  database.register('collectionItem', createCollectionItem);
  database.register('collection', createCollection);

  return database;
}

export function generateUserData(): void {
  const mediaStore = new MediaStore({
    serviceHost,
    authProvider: userAuthProvider,
  });

  const image = mapDataUriToBlob(Faker.image.dataUri(320, 240));

  mediaStore.createCollection('recents');

  for (let i = 0; i < 10; i++) {
    mediaStore.createFileFromBinary(image, {
      name: Faker.system.commonFileName(
        Faker.system.fileExt(image.type),
        image.type,
      ),
      collection: 'recents',
      occurrenceKey: Faker.random.uuid(),
    });
  }
}

export function generateTenantData(): void {
  const mediaStore = new MediaStore({
    serviceHost,
    authProvider: tenantAuthProvider,
  });

  mediaStore.createCollection('MediaServicesSample');
}
