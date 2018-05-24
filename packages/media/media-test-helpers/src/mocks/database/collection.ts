import Faker = require('faker');
import { MediaCollection } from '@atlaskit/media-store';

export type Collection = MediaCollection;

export function createCollection(name?: string): Collection {
  return {
    name: name || Faker.hacker.noun(),
    createdAt: Date.now(),
  };
}
