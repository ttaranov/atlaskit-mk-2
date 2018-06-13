import {
  Scope,
  CrossProductSearchClient,
} from '../../src/api/CrossProductSearchClient';
import { GlobalSearchResult } from '../../src/model/Result';
import { makeJiraObjectResult } from '../_test-util';

export function makeSingleResultCrossProductSearchResponse(
  scope: Scope,
  result?: GlobalSearchResult,
): Map<Scope, GlobalSearchResult[]> {
  const response = new Map();
  response.set(scope, [result || makeJiraObjectResult()]);
  return response;
}

export const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve(new Map());
  },
};

export const errorCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
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
  };
}
