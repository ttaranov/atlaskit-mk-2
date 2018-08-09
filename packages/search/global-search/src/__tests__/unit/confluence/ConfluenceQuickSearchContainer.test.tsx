import { ShallowWrapper } from 'enzyme';
import * as React from 'react';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import { Result, PersonResult } from '../../../model/Result';
import GlobalQuickSearch from '../../../components/GlobalQuickSearch';
import { Scope } from '../../../api/CrossProductSearchClient';
import * as searchResultsUtil from '../../../components/SearchResultsUtil';
import {
  delay,
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from '../_test-util';
import {
  noResultsCrossProductSearchClient,
  singleResultCrossProductSearchClient,
  makeSingleResultCrossProductSearchResponse,
} from '../mocks/_mockCrossProductSearchClient';
import {
  noResultsPeopleSearchClient,
  errorPeopleSearchClient,
} from '../mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeSingleResultQuickNavSearchResponse,
  singleResultQuickNav,
  errorConfluenceQuickNavSearch,
  makeConfluenceClient,
} from '../mocks/_mockConfluenceClient';
import ConfluenceSearchResults from '../../../components/confluence/ConfluenceSearchResults';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';

function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchFn: Function = quicksearch.prop('onSearch');
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

function render(partialProps?: Partial<Props>) {
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    useAggregatorForConfluenceObjects: false,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
}

describe('ConfluenceQuickSearchContainer', () => {
  it('should start searching when a character has been typed', async () => {
    const wrapper = render();

    // loading should start on mount while recent results are fetched
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);

    const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
    onMount();

    // check that loading is false after recent results return
    await waitForRender(wrapper);
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);

    // simulate a search
    searchFor('x', wrapper);

    // then check that loading starts...
    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);
  });

  describe('Pre-query state', () => {
    it('should render recently viewed pages', async () => {
      const mockConfluenceClient = makeConfluenceClient({
        getRecentItems() {
          return Promise.resolve([makeConfluenceObjectResult()]);
        },
      });

      const wrapper = render({
        confluenceClient: mockConfluenceClient,
      });

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyViewedPages'),
      ).toHaveLength(0);

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyViewedPages'),
      ).toHaveLength(1);
    });

    it('should render recently viewed spaces', async () => {
      const mockConfluenceClient = makeConfluenceClient({
        getRecentSpaces() {
          return Promise.resolve([makeConfluenceContainerResult()]);
        },
      });

      const wrapper = render({
        confluenceClient: mockConfluenceClient,
      });

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyViewedSpaces'),
      ).toHaveLength(0);

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyViewedSpaces'),
      ).toHaveLength(1);
    });

    it('should render recent people', async () => {
      const mockPeopleSearchClient = {
        search() {
          return Promise.resolve([]);
        },
        getRecentPeople() {
          return Promise.resolve([makePersonResult()]);
        },
      };

      const wrapper = render({
        peopleSearchClient: mockPeopleSearchClient,
      });

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyInteractedPeople'),
      ).toHaveLength(0);

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      expect(
        wrapper.find(ConfluenceSearchResults).prop('recentlyInteractedPeople'),
      ).toHaveLength(1);
    });
  });

  it('should redirect to confluence advanced search on search submit', async () => {
    const wrapper = render();

    const onSearchSubmit: Function = wrapper
      .find(GlobalQuickSearch)
      .prop('onSearchSubmit');

    const mockRedirect = jest
      .spyOn(searchResultsUtil, 'redirectToConfluenceAdvancedSearch')
      .mockImplementation(() => {});

    onSearchSubmit!({ target: { value: 'query' } });
    expect(mockRedirect).toHaveBeenCalledWith('query');
  });

  it('should redirect to confluence advanced search with full query without waiting for debounce', async () => {
    const wrapper = render();

    // do a search and let it debounce first
    searchFor('query', wrapper);

    const onSearchSubmit: Function = wrapper
      .find(GlobalQuickSearch)
      .prop('onSearchSubmit');

    const mockRedirect = jest
      .spyOn(searchResultsUtil, 'redirectToConfluenceAdvancedSearch')
      .mockImplementation(() => {});

    // now call submit with a different value
    onSearchSubmit!({ target: { value: 'query123' } });

    // assert that we don't redirect with a stale value
    expect(mockRedirect).toHaveBeenCalledWith('query123');
  });

  it('should render object results', async () => {
    const wrapper = render({
      confluenceClient: singleResultQuickNav(),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('objectResults'),
    ).toHaveLength(1);
  });

  it('should render space results', async () => {
    const wrapper = render({
      crossProductSearchClient: singleResultCrossProductSearchClient(
        Scope.ConfluenceSpace,
      ),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('spaceResults'),
    ).toHaveLength(1);
  });

  it('should render people results', async () => {
    const wrapper = render({
      peopleSearchClient: {
        search() {
          return Promise.resolve([makePersonResult()]);
        },
        getRecentPeople() {
          return Promise.resolve([]);
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('peopleResults'),
    ).toHaveLength(1);
  });

  it('should perform searches in parallel', async () => {
    /*
     1. Delay people search by 5ms
     2. Delay cross product search by 5ms
     3. Delay confluence search by 5ms
     4. Search
     5. Wait for 6ms (less than time for all searches combined)
     6. Make sure search results appeared in time
    */

    function searchPeople(query: string): Promise<PersonResult[]> {
      const personResult = makePersonResult();

      return delay(5, [personResult]);
    }

    function searchCrossProduct(query: string): Promise<Map<Scope, Result[]>> {
      return delay(
        5,
        makeSingleResultCrossProductSearchResponse(
          Scope.ConfluenceSpace,
          makeConfluenceContainerResult(),
        ),
      );
    }

    const mockCrossProductSearchClient = {
      search: jest.fn(searchCrossProduct),
    };

    const mockPeopleSearchClient = {
      search: jest.fn(searchPeople),
      getRecentPeople() {
        return Promise.resolve([]);
      },
    };

    const wrapper = render({
      crossProductSearchClient: mockCrossProductSearchClient,
      peopleSearchClient: mockPeopleSearchClient,
      confluenceClient: singleResultQuickNav(),
    });

    searchFor('once', wrapper);
    await waitForRender(wrapper, 6);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('objectResults'),
    ).toHaveLength(1);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('spaceResults'),
    ).toHaveLength(1);

    expect(
      wrapper.find(ConfluenceSearchResults).prop('peopleResults'),
    ).toHaveLength(1);
  });

  it('should not display outdated results', async () => {
    /*
      1. First search will return a delayed result
      2. Second search will return a fast result
      3. Search twice
      4. Wait until the delayed result has arrived
      5. Make sure the fast result is displayed and not the delayed result
    */
    function searchQuickNavDelayed(query: string): Promise<Result[]> {
      return delay(5, makeSingleResultQuickNavSearchResponse());
    }

    function searchQuickNavCurrent(query: string): Promise<Result[]> {
      return Promise.resolve([
        makeConfluenceObjectResult({
          name: 'current result',
        }),
      ]);
    }

    const confluenceQuickNavSearchMock = jest
      .fn()
      .mockImplementationOnce(searchQuickNavDelayed)
      .mockImplementationOnce(searchQuickNavCurrent);

    const wrapper = render({
      confluenceClient: makeConfluenceClient({
        searchQuickNav: confluenceQuickNavSearchMock,
      }),
    });

    searchFor('once - this will return the delayed result', wrapper);
    searchFor('twice - this will return the current fast result', wrapper);
    await waitForRender(wrapper, 10);

    const results = wrapper.find(ConfluenceSearchResults).prop('objectResults');

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('current result');
  });

  describe('Analytics', () => {
    it('should log when a search request fails', async () => {
      const firePrivateAnalyticsEventMock = jest.fn();

      const wrapper = render({
        peopleSearchClient: {
          search(query: string) {
            return Promise.reject(new TypeError('failed'));
          },
          getRecentPeople() {
            return Promise.resolve([]);
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
          source: 'search-people',
        },
      );
    });
  });

  describe('Error handling', () => {
    it('should show error state when confluence quick nav search fails', async () => {
      const wrapper = render({
        confluenceClient: errorConfluenceQuickNavSearch,
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);

      expect(wrapper.find(ConfluenceSearchResults).prop('isError')).toBe(true);
    });

    it('should clear error state after subsequent search', async () => {
      const searchMock = jest
        .fn()
        .mockImplementationOnce((query: string) => Promise.reject('error'))
        .mockImplementationOnce((query: string) =>
          Promise.resolve([
            makeConfluenceObjectResult({
              name: 'current result',
            }),
          ]),
        );

      const wrapper = render({
        confluenceClient: makeConfluenceClient({
          searchQuickNav: searchMock,
        }),
      });

      searchFor('error state', wrapper);
      await waitForRender(wrapper);

      expect(wrapper.find(ConfluenceSearchResults).prop('isError')).toBe(true);

      searchFor('good state', wrapper);
      await waitForRender(wrapper);

      expect(wrapper.find(ConfluenceSearchResults).prop('isError')).toBe(false);
    });

    it('should not show the error state when only people search fails', async () => {
      const wrapper = render({
        peopleSearchClient: errorPeopleSearchClient,
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);

      expect(wrapper.find(ConfluenceSearchResults).prop('isError')).toBe(false);
    });
  });

  it('should pass through the linkComponent prop', async () => {
    const MyLinkComponent = () => <div />;
    const wrapper = render({
      linkComponent: MyLinkComponent,
    });

    expect(wrapper.find(GlobalQuickSearch).prop('linkComponent')).toBe(
      MyLinkComponent,
    );
  });
});
