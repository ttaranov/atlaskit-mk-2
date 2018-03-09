import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import {
  GlobalQuickSearchContainer,
  Props,
} from '../src/components/GlobalQuickSearchContainer';
import GlobalQuickSearch, {
  Props as GlobalQuickSearchProps,
} from '../src/components/GlobalQuickSearch';
import { RecentSearchClient } from '../src/api/RecentSearchClient';
import {
  CrossProductSearchClient,
  CrossProductResults,
} from '../src/api/CrossProductSearchClient';
import { Result, ResultType } from '../src/model/Result';
import { PeopleSearchClient } from '../src/api/PeopleSearchClient';

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

const noResultsRecentSearchClient: RecentSearchClient = {
  getRecentItems() {
    return Promise.resolve([]);
  },
  search(query: string) {
    return Promise.resolve([]);
  },
};

const errorRecentSearchClient: RecentSearchClient = {
  getRecentItems() {
    return Promise.reject('error');
  },
  search(query: string) {
    return Promise.reject('error');
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

function makeResult(partial?: Partial<Result>): Result {
  return {
    resultId: '' + Math.random,
    name: '',
    type: ResultType.Object,
    avatarUrl: '',
    href: '',
    ...partial,
  };
}

function render(partialProps?: Partial<Props>) {
  const props: Props = {
    recentSearchClient: noResultsRecentSearchClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    debounceMillis: 1,
    ...partialProps,
  };

  return shallow<Props>(<GlobalQuickSearchContainer {...props} />);
}

describe('GlobalQuickSearchContainer', () => {
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

  it('should should reset loading state when an error happened', async () => {
    const wrapper = render({
      recentSearchClient: errorRecentSearchClient,
    });

    searchFor('dav', wrapper);
    await waitForRender(wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);
  });

  it('should start searching when more than one character is typed', async () => {
    const wrapper = render();

    searchFor('d', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);

    searchFor('da', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);
  });

  it('should render recent results', async () => {
    const wrapper = render({
      recentSearchClient: {
        search() {
          return Promise.resolve([makeResult()]);
        },
        getRecentItems() {
          return Promise.resolve([]);
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const recentResults = wrapper.find(GlobalQuickSearch).prop('recentResults');
    expect(recentResults).toHaveLength(1);
  });

  it('should render recently viewed items', async () => {
    const mockRecentClient = {
      getRecentItems() {
        return Promise.resolve([makeResult()]);
      },
      search(query: string) {
        return Promise.resolve([]);
      },
    };

    const wrapper = render({
      recentSearchClient: mockRecentClient,
    });

    const getRecentlyViewedItems = wrapper
      .find(GlobalQuickSearch)
      .prop('getRecentlyViewedItems');
    getRecentlyViewedItems();
    await waitForRender(wrapper);

    const recentlyViewedItems = wrapper
      .find(GlobalQuickSearch)
      .prop('recentlyViewedItems');
    expect(recentlyViewedItems).toHaveLength(1);
  });

  it('should render jira results', async () => {
    const wrapper = render({
      crossProductSearchClient: {
        search() {
          return Promise.resolve({
            jira: [makeResult()],
            confluence: [],
          });
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const jiraResults = wrapper.find(GlobalQuickSearch).prop('jiraResults');
    expect(jiraResults).toHaveLength(1);

    const confluenceResults = wrapper
      .find(GlobalQuickSearch)
      .prop('confluenceResults');
    expect(confluenceResults).toHaveLength(0);
  });

  it('should render confluence results', async () => {
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

    const jiraResults = wrapper.find(GlobalQuickSearch).prop('jiraResults');
    expect(jiraResults).toHaveLength(0);

    const confluenceResults = wrapper
      .find(GlobalQuickSearch)
      .prop('confluenceResults');
    expect(confluenceResults).toHaveLength(1);
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

    const peopleResults = wrapper.find(GlobalQuickSearch).prop('peopleResults');
    expect(peopleResults).toHaveLength(1);
  });

  it('should perform searches in parallel', async () => {
    /*
     1. Delay recent search by 5ms
     2. Delay cross product search by 5ms
     3. Search
     4. Wait for 6ms (less than time for both searches combined)
     5. Make sure search results appeared in time
    */

    function searchRecent(query: string): Promise<Result[]> {
      return delay(5, [makeResult()]);
    }

    function searchCrossProduct(query: string): Promise<CrossProductResults> {
      return delay(5, {
        jira: [makeResult()],
        confluence: [],
      });
    }

    const mockSearchClient = {
      search: jest.fn(searchCrossProduct),
    };

    const mockRecentSearchClient = {
      getRecentItems: jest.fn(),
      search: jest.fn(searchRecent),
    };

    const wrapper = render({
      recentSearchClient: mockRecentSearchClient,
      crossProductSearchClient: mockSearchClient,
    });

    searchFor('once', wrapper);
    await waitForRender(wrapper, 6);

    const jiraResults = wrapper.find(GlobalQuickSearch).prop('jiraResults');
    const recentResults = wrapper.find(GlobalQuickSearch).prop('recentResults');

    expect(jiraResults).not.toHaveLength(0);
    expect(recentResults).not.toHaveLength(0);
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
        jira: [makeResult({ name: 'delayed result' })],
        confluence: [],
      });
    }

    function searchCurrent(query: string): Promise<CrossProductResults> {
      return Promise.resolve({
        jira: [makeResult({ name: 'current result' })],
        confluence: [],
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
      recentSearchClient: noResultsRecentSearchClient,
      crossProductSearchClient: mockSearchClient,
    });

    searchFor('once - this will return the delayed result', wrapper);
    searchFor('twice - this will return the current fast result', wrapper);
    await waitForRender(wrapper, 10);

    const jiraResults = wrapper.find(GlobalQuickSearch).prop('jiraResults');
    expect(jiraResults[0].name).toBe('current result');
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

      expect(firePrivateAnalyticsEventMock).toHaveBeenCalled();
    });
  });
});
