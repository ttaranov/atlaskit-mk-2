import { MediaCollection } from '@atlaskit/media-store';
import { getHackerNoun } from './mockData';

export function createCollection(name?: string): MediaCollection {
  return {
    name: name || getHackerNoun(),
    createdAt: Date.now(),
  };
}
