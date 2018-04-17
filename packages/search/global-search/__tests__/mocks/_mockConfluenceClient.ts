import { ConfluenceClient } from '../src/api/ConfluenceClient';

export const noResultsConfluenceClient: ConfluenceClient = {
  getRecentPages() {
    return Promise.resolve([]);
  },
  getRecentSpaces() {
    return Promise.resolve([]);
  },
};
