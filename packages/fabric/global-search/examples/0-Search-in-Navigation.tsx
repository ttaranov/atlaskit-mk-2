import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import * as fetchMock from 'fetch-mock';

// tslint:disable-next-line
const recentResponse = require('../example-helpers/recent.json');
// tslint:disable-next-line
const searchResponse = require('../example-helpers/search.json');

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

    return delay(600, results);
  });
}

export default class extends React.Component {
  componentWillMount() {
    mockRecentApi();
    mockCrossProductSearchApi();
  }

  componentWillUnmount() {
    fetchMock.restore();
  }

  render() {
    return (
      <BasicNavigation
        searchDrawerContent={
          <GlobalQuickSearch cloudId="cloudId" environment="local" />
        }
      />
    );
  }
}
