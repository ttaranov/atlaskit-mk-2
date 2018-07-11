import { ConfluenceClient } from '../../../api/ConfluenceClient';
import { makeConfluenceObjectResult } from '../_test-util';
import { Result } from '../../../model/Result';

const EMPTY_PROMISE = () => Promise.resolve([]);

export const noResultsConfluenceClient: ConfluenceClient = {
  getRecentItems: EMPTY_PROMISE,
  getRecentSpaces: EMPTY_PROMISE,
  searchQuickNav: EMPTY_PROMISE,
};

export const makeConfluenceClient = (
  client: Partial<ConfluenceClient>,
): ConfluenceClient => {
  return {
    ...noResultsConfluenceClient,
    ...client,
  };
};

export function makeSingleResultQuickNavSearchResponse(
  result?: Result,
): Result[] {
  return [result || makeConfluenceObjectResult()];
}

export const singleResultQuickNav = (result?: Result): ConfluenceClient => {
  return makeConfluenceClient({
    searchQuickNav(query: string) {
      return Promise.resolve([result || makeConfluenceObjectResult()]);
    },
  });
};

export const errorConfluenceQuickNavSearch: ConfluenceClient = makeConfluenceClient(
  {
    searchQuickNav(query: string) {
      return Promise.reject('error');
    },
  },
);
