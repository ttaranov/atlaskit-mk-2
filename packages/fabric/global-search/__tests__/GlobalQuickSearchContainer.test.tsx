import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearchContainer, {
  Props,
} from '../src/components/GlobalQuickSearchContainer';
import GlobalQuickSearch, {
  Props as GlobalQuickSearchProps,
} from '../src/components/GlobalQuickSearch';
import { RecentSearchProvider } from '../src/api/RecentSearchProvider';
import {
  CrossProductSearchProvider,
  CrossProductResults,
} from '../src/api/CrossProductSearchProvider';
import { Result, ResultType } from '../src/model/Result';
import { PeopleSearchProvider } from '../src/api/PeopleSearchProvider';

function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchInput = quicksearch.props()['search'];
  onSearchInput(query);
}

const noResultsRecentSearchProvider: RecentSearchProvider = {
  getRecentItems() {
    return Promise.resolve([]);
  },
  search(query: string) {
    return Promise.resolve([]);
  },
};

const errorRecentSearchProvider: RecentSearchProvider = {
  getRecentItems() {
    return Promise.reject('error');
  },
  search(query: string) {
    return Promise.reject('error');
  },
};

const noResultsCrossProductSearchProvider: CrossProductSearchProvider = {
  search(query: string) {
    return Promise.resolve({ jira: [], confluence: [] });
  },
};

const noResultsPeopleSearchProvider: PeopleSearchProvider = {
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
    recentSearchProvider: noResultsRecentSearchProvider,
    crossProductSearchProvider: noResultsCrossProductSearchProvider,
    peopleSearchProvider: noResultsPeopleSearchProvider,
    debounceMillis: 1,
    ...partialProps,
  };

  return shallow<Props>(<GlobalQuickSearchContainer {...props} />);
}

describe('GlobalQuickSearchContainer', () => {
  it('should set loading state when searching', () => {
    const wrapper = render();

    searchFor('dav', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeTruthy();
  });

  it('should unset loading state when search has finished', async () => {
    const wrapper = render();

    searchFor('dav', wrapper);
    await delay();
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();
  });

  it('should should reset loading state when an error happened', async () => {
    const wrapper = render({
      recentSearchProvider: errorRecentSearchProvider,
    });

    searchFor('dav', wrapper);
    await delay();
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();
  });

  it('should start searching when more than one character is typed', async () => {
    const wrapper = render();

    searchFor('d', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();

    searchFor('da', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeTruthy();
  });

  it('should render recent results', async () => {
    const wrapper = render({
      recentSearchProvider: {
        search() {
          return Promise.resolve([makeResult()]);
        },
        getRecentItems() {
          return Promise.resolve([]);
        },
      },
    });

    searchFor('query', wrapper);
    await delay();
    expect(wrapper.find(GlobalQuickSearch).prop('recentResults')).toHaveLength(
      1,
    );
  });

  it('should render recently viewed items', async () => {
    const mockRecentProvider = {
      getRecentItems() {
        return Promise.resolve([makeResult()]);
      },
      search(query: string) {
        return Promise.resolve([]);
      },
    };

    const wrapper = render({
      recentSearchProvider: mockRecentProvider,
    });

    const getRecentlyViewedItems = wrapper
      .find(GlobalQuickSearch)
      .prop('getRecentlyViewedItems');
    getRecentlyViewedItems();
    await delay();
    expect(
      wrapper.find(GlobalQuickSearch).prop('recentlyViewedItems'),
    ).toHaveLength(1);
  });

  it('should render jira and confluence results', async () => {
    const wrapper = render({
      crossProductSearchProvider: {
        search() {
          return Promise.resolve({
            jira: [makeResult()],
            confluence: [makeResult()],
          });
        },
      },
    });

    searchFor('query', wrapper);
    await delay();
    expect(wrapper.find(GlobalQuickSearch).prop('jiraResults')).toHaveLength(1);
    expect(
      wrapper.find(GlobalQuickSearch).prop('confluenceResults'),
    ).toHaveLength(1);
  });

  it('should render people results', async () => {
    const wrapper = render({
      peopleSearchProvider: {
        search() {
          return Promise.resolve([makeResult()]);
        },
      },
    });

    searchFor('query', wrapper);
    await delay();
    expect(wrapper.find(GlobalQuickSearch).prop('peopleResults')).toHaveLength(
      1,
    );
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

    const mockSearchProvider = {
      search: jest.fn(searchCrossProduct),
    };

    const mockRecentSearchProvider = {
      getRecentItems: jest.fn(),
      search: jest.fn(searchRecent),
    };

    const wrapper = render({
      recentSearchProvider: mockRecentSearchProvider,
      crossProductSearchProvider: mockSearchProvider,
    });

    searchFor('once', wrapper);
    await delay(6);

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

    const mockSearchProvider = {
      search: searchMock,
    };

    const wrapper = render({
      recentSearchProvider: noResultsRecentSearchProvider,
      crossProductSearchProvider: mockSearchProvider,
    });

    searchFor('once - this will return the delayed result', wrapper);
    searchFor('twice - this will return the current fast result', wrapper);
    await delay(10);

    const jiraResults = wrapper.find(GlobalQuickSearch).prop('jiraResults');
    expect(jiraResults[0].name).toBe('current result');
  });
});
