import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../src/components/confluence/ConfluenceQuickSearchContainer';
import GlobalQuickSearch, {
  Props as GlobalQuickSearchProps,
} from '../src/components/GlobalQuickSearch';
import { RecentSearchClient } from '../src/api/RecentSearchClient';
import {
  CrossProductSearchClient,
  CrossProductResults,
} from '../src/api/CrossProductSearchClient';
import { ConfluenceClient } from '../src/api/ConfluenceClient';
import { Result, ResultType } from '../src/model/Result';
import { PeopleSearchClient } from '../src/api/PeopleSearchClient';
import SearchError from '../src/components/SearchError';
import { makeResult } from './_test-util';

function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchFn = quicksearch.prop('onSearch');
  onSearchFn(query);
  wrapper.update();
}

/**
 * This component uses a lot of internal state and async calls.
 * Make sure we wait for next tick and then force render update for React 16.
 */
async function waitForRender(wrapper: ShallowWrapper, millis?: number) {
  await delay(millis);
  wrapper.update();
}

const noResultConfluenceClient: ConfluenceClient = {
  getRecentPages() {
    return Promise.resolve([]);
  },
  getRecentSpaces() {
    return Promise.resolve([]);
  },
};

const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve({ jira: [], confluence: [] });
  },
};

const noResultsPeopleSearchClient: PeopleSearchClient = {
  search(query: string) {
    return Promise.resolve([]);
  },
};

enum Group {
  Objects = 'objects',
  Spaces = 'spaces',
  People = 'people',
}

function findGroup(group: Group, wrapper: ShallowWrapper) {
  return wrapper
    .find(ResultItemGroup)
    .findWhere(n => n.prop('test-selector') === group.valueOf());
}

function render(partialProps?: Partial<Props>) {
  const props: Props = {
    confluenceClient: noResultConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    ...partialProps,
  };

  return shallow<Props>(<ConfluenceQuickSearchContainer {...props} />);
}

describe('ConfluenceQuickSearchContainer', () => {
  describe('loading state', () => {
    it('should set loading state when searching', () => {
      const wrapper = render();

      searchFor('dav', wrapper);
      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);
    });

    it('should unset loading state when search has finished', async () => {
      const wrapper = render();

      searchFor('dav', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);
    });

    it('should unset loading state when all promises have settled', async () => {
      /**
       * 0. people search errors out immediately, xpsearch takes 5ms
       * 1. Make sure immediately that loading state is set
       * 2. Wait 6ms until xpsearch has finished
       * 3. Make sure loading state is unset
       */
      const wrapper = render({
        peopleSearchClient: {
          search(query: string) {
            return Promise.reject('error');
          },
        },
        crossProductSearchClient: {
          search(query: string) {
            return delay(5, {
              jira: [],
              confluence: [],
            });
          },
        },
      });

      searchFor('disco', wrapper);

      await waitForRender(wrapper);
      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);

      await waitForRender(wrapper, 6);
      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);
    });
  });

  it('should start searching when more than one character is typed', async () => {
    const wrapper = render();

    searchFor('d', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);

    searchFor('da', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);
  });

  it.skip('should render recently viewed pages on mount', async () => {
    const mockConfluenceClient = {
      getRecentPages() {
        return Promise.resolve([makeResult()]);
      },
      getRecentSpaces() {
        return Promise.resolve([]);
      },
    };

    const wrapper = render({
      confluenceClient: mockConfluenceClient,
    });

    const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
    onMount();

    await waitForRender(wrapper);

    const group = findGroup(Group.Objects, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it.skip('should render recently viewed spaces on mount', async () => {
    const mockConfluenceClient = {
      getRecentPages() {
        return Promise.resolve([]);
      },
      getRecentSpaces() {
        return Promise.resolve([makeResult()]);
      },
    };

    const wrapper = render({
      confluenceClient: mockConfluenceClient,
    });

    const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
    onMount();

    await waitForRender(wrapper);

    const group = findGroup(Group.Spaces, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it('should render object results', async () => {
    const wrapper = render({
      crossProductSearchClient: {
        search() {
          return Promise.resolve({
            jira: [],
            confluence: [makeResult()],
          });
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.Objects, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it('should render space results', async () => {
    const wrapper = render({
      crossProductSearchClient: {
        search() {
          return Promise.resolve({
            jira: [],
            confluence: [makeResult()],
          });
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.Objects, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it('should render people results', async () => {
    const wrapper = render({
      peopleSearchClient: {
        search() {
          return Promise.resolve([makeResult()]);
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.People, wrapper);
    expect(group.children()).toHaveLength(2); // result + search people item
  });

  it('should perform searches in parallel', async () => {
    /*
     1. Delay people search by 5ms
     2. Delay cross product search by 5ms
     3. Search
     4. Wait for 6ms (less than time for both searches combined)
     5. Make sure search results appeared in time
    */

    function searchPeople(query: string): Promise<Result[]> {
      return delay(5, [makeResult()]);
    }

    function searchCrossProduct(query: string): Promise<CrossProductResults> {
      return delay(5, {
        jira: [],
        confluence: [makeResult()],
      });
    }

    const mockCrossProductSearchClient = {
      search: jest.fn(searchCrossProduct),
    };

    const mockPeopleSearchClient = {
      search: jest.fn(searchPeople),
    };

    const wrapper = render({
      crossProductSearchClient: mockCrossProductSearchClient,
      peopleSearchClient: mockPeopleSearchClient,
    });

    searchFor('once', wrapper);
    await waitForRender(wrapper, 6);

    const objectResults = findGroup(Group.Objects, wrapper).children();
    const peopleResults = findGroup(Group.People, wrapper).children();

    expect(objectResults).not.toHaveLength(0);
    expect(peopleResults).not.toHaveLength(0);
  });

  it('should not display outdated results', async () => {
    /*
      1. First search will return a delayed result
      2. Second search will return a fast result
      3. Search twice
      4. Wait until the delayed result has arrived
      5. Make sure the fast result is displayed and not the delayed result
    */

    function searchDelayed(query: string): Promise<CrossProductResults> {
      return delay(5, {
        jira: [],
        confluence: [makeResult({ name: 'delayed result' })],
      });
    }

    function searchCurrent(query: string): Promise<CrossProductResults> {
      return Promise.resolve({
        jira: [],
        confluence: [makeResult({ name: 'current result' })],
      });
    }

    const searchMock = jest
      .fn()
      .mockImplementationOnce(searchDelayed)
      .mockImplementationOnce(searchCurrent);

    const mockSearchClient = {
      search: searchMock,
    };

    const wrapper = render({
      crossProductSearchClient: mockSearchClient,
    });

    searchFor('once - this will return the delayed result', wrapper);
    searchFor('twice - this will return the current fast result', wrapper);
    await waitForRender(wrapper, 10);

    const objectResults = findGroup(Group.Objects, wrapper).children();
    expect(objectResults.first().prop('name')).toBe('current result');
  });

  describe('Analytics', () => {
    it('should log when a request fails', async () => {
      const firePrivateAnalyticsEventMock = jest.fn();

      const wrapper = render({
        peopleSearchClient: {
          search(query: string) {
            return Promise.reject(new TypeError('failed'));
          },
        },
        firePrivateAnalyticsEvent: firePrivateAnalyticsEventMock,
      });

      searchFor('err', wrapper);
      await delay();

      expect(firePrivateAnalyticsEventMock).toHaveBeenCalledWith(
        'atlassian.fabric.global-search.search-error',
        {
          name: 'TypeError',
          message: 'failed',
          source: 'people',
        },
      );
    });
  });

  describe('Error handling', () => {
    const errorCrossProductSearchClient: CrossProductSearchClient = {
      search(query: string) {
        return Promise.reject('error');
      },
    };

    it('should show error state when xpsearch fails', async () => {
      const wrapper = render({
        crossProductSearchClient: errorCrossProductSearchClient,
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(true);
    });

    it('should not show the error state when only people search fails', async () => {
      const wrapper = render({
        peopleSearchClient: {
          search(query: string) {
            return Promise.reject(new TypeError('failed'));
          },
        },
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(false);
    });
  });
});
