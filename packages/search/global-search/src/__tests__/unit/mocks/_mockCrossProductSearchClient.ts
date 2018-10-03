import {
  ABTest,
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  SearchSession,
} from '../../../api/CrossProductSearchClient';
import { Scope } from '../../../api/types';
import { Result } from '../../../model/Result';
import { makeJiraObjectResult } from '../_test-util';

export function makeSingleResultCrossProductSearchResponse(
  scope: Scope,
  result?: Result,
): CrossProductSearchResults {
  const response = new Map();
  response.set(scope, [result || makeJiraObjectResult()]);
  return { results: response };
}

export const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
  },
  getAbTestData(scope: Scope, searchSession: SearchSession) {
    return Promise.resolve(undefined);
  },
};

export const errorCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
  getAbTestData(scope: Scope, searchSession: SearchSession) {
    return Promise.reject('error');
  },
};

export function singleResultCrossProductSearchClient(
  scope: Scope,
): CrossProductSearchClient {
  return {
    search(query: string) {
      return Promise.resolve(makeSingleResultCrossProductSearchResponse(scope));
    },
    getAbTestData(scope: Scope, searchSession: SearchSession) {
      return Promise.resolve(undefined);
    },
  };
}

export const mockCrossProductSearchClient = (
  data: CrossProductSearchResults,
  abTest?: ABTest,
): CrossProductSearchClient => ({
  search(
    query: string,
    searchSession: SearchSession,
    scopes: Scope[],
  ): Promise<CrossProductSearchResults> {
    return Promise.resolve(data);
  },
  getAbTestData(
    scope: Scope,
    searchSession: SearchSession,
  ): Promise<ABTest | undefined> {
    return Promise.resolve(abTest);
  },
});
