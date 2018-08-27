import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import {
  makePeopleSearchData,
  recentData,
  makeCrossProductSearchData,
  makeConfluenceRecentPagesData,
  makeConfluenceRecentSpacesData,
  makeQuickNavSearchData,
} from './mockData';
import { JiraRecentResponse } from './jiraRecentResponseData';

type Request = {
  json: Function;
  url: string;
};

type MocksConfig = {
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
  fetchMock.post(new RegExp('/quicksearch/v1'), async (request: Request) => {
    const body = await request.json();
    const query = body.query;
    const results = queryMockSearch(query);

    return delay(delayMs, results);
  });
}

function mockQuickNavApi(delayMs: number) {
  fetchMock.mock(new RegExp('/quicknav/1'), async (request: Request) => {
    const query = request.url.split('query=')[1];
    const results = queryMockQuickNav(query);

    return delay(delayMs, results);
  });
}

function mockPeopleApi() {
  fetchMock.post(new RegExp('/graphql'), async (request: Request) => {
    const body = await request.json();
    const query = body.variables.displayName || '';
    const results = queryPeopleSearch(query);

    return delay(500, results);
  });
}

function mockJiraApi() {
  fetchMock.get(
    new RegExp('/rest/internal/2/productsearch/recent?'),
    async request => delay(500, JiraRecentResponse),
  );
}

export function setupMocks(config: MocksConfig = DEFAULT_MOCKS_CONFIG) {
  mockRecentApi();
  mockCrossProductSearchApi(config.crossProductSearchDelay);
  mockPeopleApi();
  mockConfluenceRecentApi();
  mockQuickNavApi(config.quickNavDelay);
  mockJiraApi();
}

export function teardownMocks() {
  fetchMock.restore();
}
