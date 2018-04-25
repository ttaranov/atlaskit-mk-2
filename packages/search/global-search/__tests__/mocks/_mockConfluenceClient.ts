import { ConfluenceClient } from '../../src/api/ConfluenceClient';

export const noResultsConfluenceClient: ConfluenceClient = {
  getRecentItems() {
    return Promise.resolve([]);
  },
  getRecentSpaces() {
    return Promise.resolve([]);
  },
};
