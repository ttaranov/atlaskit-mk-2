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
    const getSearchResultsComponent = jest.fn(() => {});
    const wrapper = mountQuickSearchContainer({
      getRecentItems,
      getSearchResultsComponent,
    });

    let globalQuickSearch = wrapper.find(GlobalQuickSearch);
    await globalQuickSearch.props().onMount();
    await wrapper.update();

    // after update
    globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.props().isLoading).toBe(false);
    expect(getRecentItems).toHaveBeenCalled();
    assertLastCall(getSearchResultsComponent, {
      recentItems,
      isLoading: false,
      isError: false,
    });
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
    const getSearchResults = jest.fn(() => Promise.resolve(searchResults));
    const getSearchResultsComponent = jest.fn(() => {});
    const wrapper = mountQuickSearchContainer({
      getSearchResults,
      getSearchResultsComponent,
    });
    await waitForRender(wrapper, 10);

    let globalQuickSearch = wrapper.find(GlobalQuickSearch);
    await globalQuickSearch.props().onSearch(query);
    await waitForRender(wrapper, 10);

    globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.props().isLoading).toBe(false);

    expect(getSearchResults).toHaveBeenCalledTimes(1);
    assertLastCall(getSearchResultsComponent, {
      searchResults,
      isLoading: false,
      isError: false,
    });
  });
});
