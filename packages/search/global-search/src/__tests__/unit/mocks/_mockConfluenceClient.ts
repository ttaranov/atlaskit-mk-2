import { ConfluenceClient } from '../../../api/ConfluenceClient';
import { makeConfluenceObjectResult, makePersonResult } from '../_test-util';
import { Result } from '../../../model/Result';

const EMPTY_PROMISE = () => Promise.resolve([]);

export const noResultsConfluenceClient: ConfluenceClient = {
  getRecentItems: EMPTY_PROMISE,
  getRecentSpaces: EMPTY_PROMISE,
  searchPeopleInQuickNav: EMPTY_PROMISE,
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
    searchPeopleInQuickNav(query: string) {
      return Promise.resolve([result || makePersonResult()]);
    },
  });
};

export const errorConfluenceQuickNavSearch: ConfluenceClient = makeConfluenceClient(
  {
    searchPeopleInQuickNav(query: string) {
      return Promise.reject('error');
    },
  },
);
