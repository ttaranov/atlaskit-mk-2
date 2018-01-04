import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import * as fetchMock from 'fetch-mock';

// tslint:disable-next-line
const recentResponse = require('../example-helpers/recent.json');
// tslint:disable-next-line
const searchResponse = require('../example-helpers/search.json');
// tslint:disable-next-line
const peopleResponse = require('../example-helpers/people.json');

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

export default class extends React.Component {
  componentWillMount() {
    mockRecentApi();
    mockCrossProductSearchApi();
    mockPeopleApi();
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
