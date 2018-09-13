import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import {
  makePeopleSearchData,
  recentData,
  makeCrossProductSearchData,
  makeConfluenceRecentPagesData,
  makeConfluenceRecentSpacesData,
  makeQuickNavSearchData,
  mockJiraSearchData,
  mapRequestScopes,
} from './mockData';
import { JiraRecentResponse } from './jiraRecentResponseData';

type Request = string;

type Options = {
  body: string;
};

export type MocksConfig = {
  crossProductSearchDelay: number;
  quickNavDelay: number;
};

const DEFAULT_MOCKS_CONFIG: MocksConfig = {
  crossProductSearchDelay: 650,
  quickNavDelay: 500,
};

const recentResponse = recentData();
const confluenceRecentPagesResponse = makeConfluenceRecentPagesData();
const confluenceRecentSpacesResponse = makeConfluenceRecentSpacesData();
const queryMockSearch = makeCrossProductSearchData();
const queryMockQuickNav = makeQuickNavSearchData();
const queryPeopleSearch = makePeopleSearchData();
const queryJiraSearch = mockJiraSearchData();

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

function mockRecentApi() {
  fetchMock.get(new RegExp('/api/client/recent\\?'), recentResponse);
}

function mockConfluenceRecentApi() {
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent/spaces\\?'),
    confluenceRecentSpacesResponse,
  );
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent\\?'),
    confluenceRecentPagesResponse,
  );
}

function mockCrossProductSearchApi(delayMs: number) {
  fetchMock.post(
    new RegExp('/quicksearch/v1'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.query;
      const results = queryMockSearch(query);

      return delay(delayMs, results);
    },
  );
}

function mockQuickNavApi(delayMs: number) {
  fetchMock.mock(new RegExp('/quicknav/1'), (request: Request) => {
    const query = request.split('query=')[1];
    const results = queryMockQuickNav(query);

    return delay(delayMs, results);
  });
}

function mockPeopleApi() {
  fetchMock.post(
    new RegExp('/graphql'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.variables.displayName || '';
      const results = queryPeopleSearch(query);

      return delay(500, results);
    },
  );
}

function mockJiraRecentApi() {
  fetchMock.get(
    new RegExp('/rest/internal/2/productsearch/recent?'),
    async request => delay(500, JiraRecentResponse),
  );
}

function mockCrossProductSearchApiV2() {
  fetchMock.post(
    new RegExp('/rest/quicksearch/v2'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.query.string;
      const requestScops = body.scopes;
      const scopes = mapRequestScopes(requestScops, queryJiraSearch(query), {
        issues: 8,
        boards: 2,
        projects: 2,
        filters: 2,
      });
      return delay(500, { scopes });
    },
  );
}

export function setupMocks(config: MocksConfig = DEFAULT_MOCKS_CONFIG) {
  mockRecentApi();
  mockCrossProductSearchApi(config.crossProductSearchDelay);
  mockPeopleApi();
  mockConfluenceRecentApi();
  mockQuickNavApi(config.quickNavDelay);
  mockJiraRecentApi();
  mockCrossProductSearchApiV2();
}

export function teardownMocks() {
  fetchMock.restore();
}
