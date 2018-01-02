import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearchContainer from '../components/GlobalQuickSearchContainer';
import GlobalQuickSearch from '../components/GlobalQuickSearch';
import { RecentSearchProvider } from '../api/RecentSearchProvider';
import { CrossProductSearchProvider } from '../api/CrossProductSearchProvider';

function timeout(ms = 1) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchInput = quicksearch.props()['search'];

  onSearchInput(query);
  await timeout(); // wait a tick until search request has finished
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
    return Promise.resolve({
      jira: [],
      confluence: [],
    });
  },
};

describe('GlobalQuickSearchContainer', () => {
  it('should set loading state when searching', () => {
    const wrapper = shallow(
      <GlobalQuickSearchContainer
        recentSearchProvider={noResultsRecentSearchProvider}
        crossProductSearchProvider={noResultsCrossProductSearchProvider}
      />,
    );

    searchFor('dav', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeTruthy();
  });

  it('should unset loading state when search has finished', async () => {
    const wrapper = shallow(
      <GlobalQuickSearchContainer
        recentSearchProvider={noResultsRecentSearchProvider}
        crossProductSearchProvider={noResultsCrossProductSearchProvider}
      />,
    );

    await searchFor('dav', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();
  });

  it('should should reset loading state when an error happened', async () => {
    const wrapper = shallow(
      <GlobalQuickSearchContainer
        recentSearchProvider={errorRecentSearchProvider}
        crossProductSearchProvider={noResultsCrossProductSearchProvider}
      />,
    );

    await searchFor('dav', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();
  });

  it('should start searching when more than one character is typed', async () => {
    const wrapper = shallow(
      <GlobalQuickSearchContainer
        recentSearchProvider={noResultsRecentSearchProvider}
        crossProductSearchProvider={noResultsCrossProductSearchProvider}
      />,
    );

    searchFor('d', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeFalsy();

    searchFor('da', wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBeTruthy();
  });

  it('should get recent items', async () => {
    const getRecentItemsMock = jest.fn();

    const mockRecentProvider = {
      getRecentItems: getRecentItemsMock,
      search(query: string) {
        return Promise.resolve([]);
      },
    };

    const wrapper = shallow(
      <GlobalQuickSearchContainer
        recentSearchProvider={mockRecentProvider}
        crossProductSearchProvider={noResultsCrossProductSearchProvider}
      />,
    );
    const getRecentlyViewedItems = wrapper
      .find(GlobalQuickSearch)
      .prop('getRecentlyViewedItems');

    getRecentlyViewedItems();
    expect(getRecentItemsMock).toHaveBeenCalledTimes(1);
  });
});
