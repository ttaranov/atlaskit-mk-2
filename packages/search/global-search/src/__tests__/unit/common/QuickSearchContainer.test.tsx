import * as React from 'react';
import { intl } from '../helpers/_intl-enzyme-test-helper';
import { mount, ReactWrapper } from 'enzyme';
import {
  QuickSearchContainer,
  SearchResultProps,
  Props,
} from '../../../components/common/QuickSearchContainer';
import { GlobalQuickSearch } from '../../../components/GlobalQuickSearch';
import { delay } from '../_test-util';

const defaultProps = {
  getSearchResultsComponent: jest.fn((props: SearchResultProps) => null),
  getRecentItems: jest.fn((sessionId: string) => Promise.resolve({})),
  getSearchResults: jest.fn(
    (query: string, sessionId: string, startTime: number) =>
      Promise.resolve({}),
  ),
  fireShownPreQueryEvent: jest.fn(
    (
      searchSessionId: string,
      recentItems: object,
      requestStartTime?: number,
    ) => {},
  ),
  fireShownPostQueryEvent: jest.fn(
    (
      startTime: number,
      elapsedMs: number,
      searchResults: object,
      searchSessionId: string,
      latestSearchQuery: string,
    ) => {},
  ),
  intl,
};

const mountQuickSearchContainer = (partialProps?: Partial<Props>) => {
  const props = {
    ...defaultProps,
    ...partialProps,
  };
  return mount(<QuickSearchContainer {...props} />);
};

async function waitForRender(wrapper: ReactWrapper, millis?: number) {
  await delay(millis);
  wrapper.update();
}

const assertLastCall = (spy, obj) => {
  expect(spy).toHaveBeenCalled();
  const getSearchResultComponentLastCall =
    spy.mock.calls[spy.mock.calls.length - 1];
  expect(getSearchResultComponentLastCall[0]).toMatchObject(obj);
};

describe('QuickSearchContainer', () => {
  const assertPreQueryAnalytics = recentItems => {
    expect(defaultProps.fireShownPreQueryEvent).toBeCalled();
    const lastCall =
      defaultProps.fireShownPreQueryEvent.mock.calls[
        defaultProps.fireShownPreQueryEvent.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.any(String),
      recentItems,
      expect.any(Number),
    ]);
  };

  const assertPostQueryAnalytics = (query, searchResults) => {
    expect(defaultProps.fireShownPostQueryEvent).toBeCalled();
    const lastCall =
      defaultProps.fireShownPostQueryEvent.mock.calls[
        defaultProps.fireShownPostQueryEvent.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.any(Number), // start time
      expect.any(Number), // elapsed time
      searchResults,
      expect.any(String), // session id
      query,
    ]);
  };

  beforeEach(() => {
    // reset mocks of default props
    defaultProps.fireShownPostQueryEvent.mockReset();
    defaultProps.fireShownPreQueryEvent.mockReset();
    defaultProps.getRecentItems.mockReset();
    defaultProps.getSearchResults.mockReset();
    defaultProps.getSearchResultsComponent.mockReset();
  });

  it('should render GlobalQuickSearch', () => {
    const wrapper = mountQuickSearchContainer();
    const globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.length).toBe(1);
    expect(globalQuickSearch.props().isLoading).toBe(true);
  });

  it('should render recent items after mount', async () => {
    const recentItems = {
      recentPages: [
        {
          id: 'page-1',
        },
      ],
    };
    const getRecentItems = jest.fn(() => Promise.resolve(recentItems));
    const wrapper = mountQuickSearchContainer({
      getRecentItems,
    });

    let globalQuickSearch = wrapper.find(GlobalQuickSearch);
    await globalQuickSearch.props().onMount();
    await wrapper.update();

    // after update
    globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.props().isLoading).toBe(false);
    expect(getRecentItems).toHaveBeenCalled();
    assertLastCall(defaultProps.getSearchResultsComponent, {
      recentItems,
      isLoading: false,
      isError: false,
    });

    assertPreQueryAnalytics(recentItems);
  });

  describe('Search', () => {
    let getSearchResults;

    const renderAndWait = async (getRecentItems?) => {
      const wrapper = mountQuickSearchContainer({
        getSearchResults,
        ...(getRecentItems ? { getRecentItems } : {}),
      });
      await waitForRender(wrapper, 10);
      return wrapper;
    };

    const search = async (wrapper, query, resultPromise) => {
      getSearchResults.mockReturnValueOnce(resultPromise);
      let globalQuickSearch = wrapper.find(GlobalQuickSearch);
      await globalQuickSearch.props().onSearch(query);
      await waitForRender(wrapper, 10);

      globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.props().isLoading).toBe(false);

      expect(getSearchResults).toHaveBeenCalledTimes(1);
      expect(getSearchResults.mock.calls[0][0]).toBe(query);
      return wrapper;
    };

    beforeEach(() => {
      getSearchResults = jest.fn();
    });

    it('should handle search', async () => {
      const searchResults = {
        spaces: [
          {
            key: 'space-1',
          },
        ],
      };
      const query = 'query';
      const wrapper = await renderAndWait();
      await search(wrapper, query, Promise.resolve(searchResults));
      assertLastCall(defaultProps.getSearchResultsComponent, {
        searchResults,
        isLoading: false,
        isError: false,
      });
      assertPostQueryAnalytics(query, searchResults);
    });

    it('should hanldle error', async () => {
      const query = 'queryWithError';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });
    });

    it('should clear error after new query', async () => {
      const query = 'queryWithError2';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });

      const newQuery = 'newQuery';
      const searchResults = {
        spaces: [
          {
            key: 'space-2',
          },
        ],
      };
      getSearchResults.mockReset();
      await search(wrapper, newQuery, Promise.resolve(searchResults));
      assertLastCall(defaultProps.getSearchResultsComponent, {
        isLoading: false,
        isError: false,
        latestSearchQuery: newQuery,
      });
      assertPostQueryAnalytics(newQuery, searchResults);
    });
  });
});
