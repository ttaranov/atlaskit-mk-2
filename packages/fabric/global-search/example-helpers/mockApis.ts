import * as fetchMock from 'fetch-mock';
import {
  peopleData,
  recentData,
  crossProductData,
} from '../example-helpers/mockData';

const recentResponse = recentData();
const searchResponse = crossProductData();
const peopleResponse = peopleData();

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
  function doSearch(term) {
    term = term.toLowerCase();
    const items = searchResponse.data.filter(item => {
      return item.name.toLowerCase().indexOf(term) > -1;
    });

    return {
      data: items,
    };
  }

  fetchMock.get('begin:http://localhost:8080/api/search', (url: string) => {
    const parts = url.split('=');
    let query = parts[1];
    const results = doSearch(decodeURIComponent(query));

    return delay(650, results);
  });
}

function mockPeopleApi() {
  function doSearch(term) {
    term = term.toLowerCase();
    const items = peopleResponse.data.AccountCentricUserSearch.filter(item => {
      return item.fullName.toLowerCase().indexOf(term) > -1;
    });

    return {
      data: {
        AccountCentricUserSearch: items,
      },
    };
  }

  fetchMock.post('http://localhost:8080/graphql', (url, opts) => {
    const body = JSON.parse(opts.body);
    const query = body.variables.displayName;
    const results = doSearch(query);

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
