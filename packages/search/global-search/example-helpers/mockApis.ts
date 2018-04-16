import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import {
  makePeopleSearchData,
  recentData,
  makeCrossProductSearchData,
  makeConfluenceRecentPagesData,
  makeConfluenceRecentSpacesData,
} from '../example-helpers/mockData';
import { Scope } from '../src/api/CrossProductSearchClient';

const recentResponse = recentData();
const confluenceRecentPagesResponse = makeConfluenceRecentPagesData();
const confluenceRecentSpacesResponse = makeConfluenceRecentSpacesData();
const queryMockSearch = makeCrossProductSearchData();
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

function mockCrossProductSearchApi() {
  fetchMock.post(new RegExp('/quicksearch/v1'), async request => {
    const body = await request.json();
    const query = body.query;
    const results = queryMockSearch(query);

    return delay(650, results);
  });
}

function mockPeopleApi() {
  fetchMock.post(new RegExp('/graphql'), async request => {
    const body = await request.json();
    const query = body.variables.displayName;
    const results = queryPeopleSearch(query);

    return delay(500, results);
  });
}

export function setupMocks() {
  mockRecentApi();
  mockCrossProductSearchApi();
  mockPeopleApi();
  mockConfluenceRecentApi();
}

export function teardownMocks() {
  fetchMock.restore();
}
