import {
  Scope,
  CrossProductSearchClient,
} from '../../src/api/CrossProductSearchClient';
import { Result } from '../../src/model/Result';
import { makeResult } from '../_test-util';

export function makeSingleResultCrossProductSearchResponse(
  scope: Scope,
  result?: Result,
): Map<Scope, Result[]> {
  const response = new Map();
  response.set(scope, [result || makeResult()]);
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
