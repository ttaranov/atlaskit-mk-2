import Faker = require('faker');
import { MediaUpload } from '@atlaskit/media-store';
import { ChunkId } from './chunk';

export type Upload = MediaUpload & {
  chunks: ChunkId[];
};

export function createUpload(): Upload {
  return {
    id: Faker.random.uuid(),
    created: Date.now(),
    expires: Faker.date.future().valueOf(),
    chunks: [],
  };
}
