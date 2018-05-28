import * as Faker from 'faker';
import { MediaCollection } from '@atlaskit/media-store';

export function createCollection(name?: string): MediaCollection {
  return {
    name: name || Faker.hacker.noun(),
    createdAt: Date.now(),
  };
}
