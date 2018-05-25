import * as Faker from 'faker';
import { MediaCollectionItem } from '@atlaskit/media-store';

import { mapDataUriToBlob } from '../../utils';

export type CollectionItem = MediaCollectionItem & {
  readonly collectionName?: string;
  readonly blob: Blob;
};

export type CreateCollectionItemOptions = {
  readonly name?: string;
  readonly mimeType?: string;
  readonly collectionName?: string;
  readonly occurrenceKey?: string;
  readonly blob?: Blob;
};

export function createCollectionItem({
  name,
  mimeType,
  collectionName,
  occurrenceKey,
  blob = new Blob(['Hello World'], { type: 'text/plain' }),
}: CreateCollectionItemOptions = {}): CollectionItem {
  const extension = Faker.system.fileExt(blob.type);
  return {
    id: Faker.random.uuid(),
    insertedAt: Faker.date.past().valueOf(),
    occurrenceKey: occurrenceKey || Faker.random.uuid(),
    type: 'file',
    details: {
      name: name || Faker.system.commonFileName(extension, blob.type),
      size: blob.size,
      mimeType,
      processingStatus: 'succeeded',
      mediaType: 'image',
      artifacts: {},
    },
    collectionName: collectionName || Faker.hacker.noun(),
    blob: blob || mapDataUriToBlob(Faker.image.dataUri(320, 240)),
  };
}
