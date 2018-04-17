import { CrossProductSearchClient } from '../src/api/CrossProductSearchClient';

export const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve({ jira: [], confluence: [] });
  },
};

export const errorCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
};
