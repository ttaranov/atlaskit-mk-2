import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import {
  makePeopleSearchData,
  recentData,
  makeCrossProductSearchData,
} from '../example-helpers/mockData';
import { Scope } from '../src/api/CrossProductSearchProvider';

const recentResponse = recentData();
const queryMockSearch = makeCrossProductSearchData();
const queryPeopleSearch = makePeopleSearchData();

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

function mockRecentApi() {
  fetchMock.get(
    'begin:http://localhost:8080/api/client/recent',
    recentResponse,
  );
}

function mockCrossProductSearchApi() {
  fetchMock.post('http://localhost:8080/quicksearch/v1', (url, opts) => {
    const body = JSON.parse(opts.body);
    const query = body.query;
    const results = queryMockSearch(query);

    return delay(650, results);
  });
}

function mockPeopleApi() {
  fetchMock.post('http://localhost:8080/graphql', (url, opts) => {
    const body = JSON.parse(opts.body);
    const query = body.variables.displayName;
    const results = queryPeopleSearch(query);

    return delay(500, results);
  });
}

export function setupMocks() {
  mockRecentApi();
  mockCrossProductSearchApi();
  mockPeopleApi();
}

export function teardownMocks() {
  fetchMock.restore();
}
