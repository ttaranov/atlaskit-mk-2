import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import * as seedrandom from 'seedrandom';

import {
  makePeopleSearchData,
  recentData,
  makeCrossProductSearchData,
  makeConfluenceRecentPagesData,
  makeConfluenceRecentSpacesData,
  makeQuickNavSearchData,
} from './mockData';
import { jiraRecentResponseWithAttributes } from './jiraRecentResponseDataWithAttributes';
import {
  permissionResponseWithoutUserPickerPermission,
  permissionResponseWithUserPickerPermission,
} from './jiraPermissionResponse';

type Request = string;

type Options = {
  body: string;
};

export type MocksConfig = {
  crossProductSearchDelay: number;
  quickNavDelay: number;
  jiraRecentDelay: number;
  peopleSearchDelay: number;
  canSearchUsers: boolean;
};

export const ZERO_DELAY_CONFIG: MocksConfig = {
  crossProductSearchDelay: 0,
  quickNavDelay: 0,
  jiraRecentDelay: 0,
  peopleSearchDelay: 0,
  canSearchUsers: true,
};

export const DEFAULT_MOCKS_CONFIG: MocksConfig = {
  crossProductSearchDelay: 650,
  quickNavDelay: 500,
  jiraRecentDelay: 500,
  peopleSearchDelay: 500,
  canSearchUsers: true,
};

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

function mockRecentApi(recentResponse) {
  fetchMock.get(new RegExp('/api/client/recent\\?'), recentResponse);
}

function mockConfluenceRecentApi({
  confluenceRecentPagesResponse,
  confluenceRecentSpacesResponse,
}) {
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent/spaces\\?'),
    confluenceRecentSpacesResponse,
  );
  fetchMock.get(
    new RegExp('/wiki/rest/recentlyviewed/1.0/recent\\?'),
    confluenceRecentPagesResponse,
  );
}

function mockCrossProductSearchApi(delayMs: number, queryMockSearch) {
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

function mockQuickNavApi(delayMs: number, queryMockQuickNav) {
  fetchMock.mock(new RegExp('/quicknav/1'), (request: Request) => {
    const query = request.split('query=')[1];
    const results = queryMockQuickNav(query);

    return delay(delayMs, results);
  });
}

function mockPeopleApi(delayMs: number, queryPeopleSearch) {
  fetchMock.post(
    new RegExp('/graphql'),
    (request: Request, options: Options) => {
      const body = JSON.parse(options.body);
      const query = body.variables.displayName || '';
      const results = queryPeopleSearch(query);

      return delay(delayMs, results);
    },
  );
}

function mockJiraApi(delayMs: number, canSearchUsers: boolean) {
  fetchMock.get(
    new RegExp('rest/internal/2/productsearch/recent?'),
    async request => delay(delayMs, jiraRecentResponseWithAttributes),
  );

  const permissionResponse = canSearchUsers
    ? permissionResponseWithUserPickerPermission
    : permissionResponseWithoutUserPickerPermission;
  fetchMock.get(
    '/rest/api/2/mypermissions?permissions=USER_PICKER',
    async request => delay(delayMs, permissionResponse),
  );
}

export function setupMocks(config: MocksConfig = DEFAULT_MOCKS_CONFIG) {
  seedrandom('random seed', { global: true });
  const recentResponse = recentData();
  const confluenceRecentPagesResponse = makeConfluenceRecentPagesData();
  const confluenceRecentSpacesResponse = makeConfluenceRecentSpacesData();
  const queryMockSearch = makeCrossProductSearchData();
  const queryMockQuickNav = makeQuickNavSearchData();
  const queryPeopleSearch = makePeopleSearchData();

  mockRecentApi(recentResponse);
  mockCrossProductSearchApi(config.crossProductSearchDelay, queryMockSearch);
  mockPeopleApi(config.peopleSearchDelay, queryPeopleSearch);
  mockConfluenceRecentApi({
    confluenceRecentPagesResponse,
    confluenceRecentSpacesResponse,
  });
  mockQuickNavApi(config.quickNavDelay, queryMockQuickNav);
  mockJiraApi(config.jiraRecentDelay, config.canSearchUsers);
}

export function teardownMocks() {
  fetchMock.restore();
}
