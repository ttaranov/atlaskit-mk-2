import { RecentSearchClient } from '../../../api/RecentSearchClient';

export const noResultsRecentSearchClient: RecentSearchClient = {
  getRecentItems() {
    return Promise.resolve([]);
  },
  search(query: string) {
    return Promise.resolve([]);
  },
};

export const errorRecentSearchClient: RecentSearchClient = {
  getRecentItems() {
    return Promise.reject('error');
  },
  search(query: string) {
    return Promise.reject('error');
  },
};
