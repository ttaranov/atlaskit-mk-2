import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaStore, MediaCollection } from '@atlaskit/media-store';
import { Database } from 'kakapo';
import * as Faker from 'faker';

import { mapDataUriToBlob } from '../../utils';
import { createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';
import { createUpload, Upload } from './upload';
import { Chunk } from './chunk';
import { defaultServiceHost } from '../..';

export * from './collection';
export * from './collection-item';

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
    serviceHost: defaultServiceHost,
    authProvider: tenantAuthProvider,
  });

  mediaStore.createCollection('MediaServicesSample');
}
