import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
// import { ResultItemGroup } from '@atlaskit/quick-search';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../components/confluence/ConfluenceQuickSearchContainer';
import { Result, PersonResult } from '../../model/Result';
import GlobalQuickSearch from '../../components/GlobalQuickSearch';
import { Scope } from '../../api/CrossProductSearchClient';
import SearchError from '../../components/SearchError';
import * as searchResultsUtil from '../../components/SearchResultsUtil';
import {
  delay,
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from './_test-util';
import {
  noResultsCrossProductSearchClient,
  singleResultCrossProductSearchClient,
  makeSingleResultCrossProductSearchResponse,
} from './mocks/_mockCrossProductSearchClient';
import {
  noResultsPeopleSearchClient,
  errorPeopleSearchClient,
} from './mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeSingleResultQuickNavSearchResponse,
  singleResultQuickNav,
  errorConfluenceQuickNavSearch,
  makeConfluenceClient,
} from './mocks/_mockConfluenceClient';
import * as SearchResults from '../../components/confluence/ConfluenceSearchResults';

function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchFn: Function = quicksearch.prop('onSearch');
  onSearchFn(query);
  wrapper.update();
}

declare var global: any;

/**
 * This component uses a lot of internal state and async calls.
 * Make sure we wait for next tick and then force render update for React 16.
 */
async function waitForRender(wrapper: ShallowWrapper, millis?: number) {
  await delay(millis);
  wrapper.update();
}

// enum Group {
//   Objects = 'objects',
//   Spaces = 'spaces',
//   People = 'people',
// }

// function findGroup(group: Group, wrapper: ShallowWrapper) {
//   return wrapper
//     .find(ResultItemGroup)
//     .findWhere(n => n.key() === group.valueOf());
// }

function render(partialProps?: Partial<Props>) {
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    ...partialProps,
  };

  return shallow<Props>(<ConfluenceQuickSearchContainer {...props} />);
}

describe('ConfluenceQuickSearchContainer', () => {
  let searchResultSpy;
  let originalPerformance;

  beforeEach(() => {
    searchResultSpy = jest.spyOn(SearchResults, 'default');
    originalPerformance = global.window.performance;
    global.window.performance = {
      now: () => 1,
    };
  });
  afterEach(() => {
    searchResultSpy.mockRestore();
    global.window.performance = originalPerformance;
  });

  const assertSearchResultToHaveProperty = (property: string) => {
    expect(searchResultSpy.mock.calls.length).toBeGreaterThan(1);
    const group =
      searchResultSpy.mock.calls[searchResultSpy.mock.calls.length - 1][0][
        property
      ];
    expect(group).toHaveLength(1);
    return group;
  };

  const assertResultError = (hasError: boolean) => {
    expect(searchResultSpy.mock.calls.length).toBeGreaterThan(1);
    const error =
      searchResultSpy.mock.calls[searchResultSpy.mock.calls.length - 1][0]
        .isError;
    expect(error).toBe(hasError);
  };

  describe('loading state', () => {
    it.skip('should set loading state when searching', () => {
      const wrapper = render();

      searchFor('dav', wrapper);
      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(true);
    });

    it.skip('should unset loading state when search has finished', async () => {
      const wrapper = render();

      searchFor('dav', wrapper);
      await waitForRender(wrapper);

      expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);
    });

    it.skip('should unset loading state when all promises have settled', async () => {
      /**
       * 0. people search errors out immediately, xpsearch takes 5ms
       * 1. Make sure immediately that loading state is set
       * 2. Wait 6ms until xpsearch has finished
       * 3. Make sure loading state is unset
       */
      const wrapper = render({
        peopleSearchClient: errorPeopleSearchClient,
        crossProductSearchClient: {
          search(query: string) {
            return delay(5, new Map());
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

  it('should start searching when a character has been typed', async () => {
    const wrapper = render();

    expect(wrapper.find(GlobalQuickSearch).prop('isLoading')).toBe(false);

    searchFor('x', wrapper);
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

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      assertSearchResultToHaveProperty('recentlyViewedPages');
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

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      assertSearchResultToHaveProperty('recentlyViewedSpaces');
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

      const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
      onMount();

      await waitForRender(wrapper);

      assertSearchResultToHaveProperty('recentlyInteractedPeople');
    });
  });

  it('should redirect to confluence advanced search on search submit', async () => {
    const wrapper = render();
    searchFor('query', wrapper);

    const onSearchSubmit: Function = wrapper
      .find(GlobalQuickSearch)
      .prop('onSearchSubmit');

    const mockRedirect = jest
      .spyOn(searchResultsUtil, 'redirectToConfluenceAdvancedSearch')
      .mockImplementation(() => {});

    onSearchSubmit();
    expect(mockRedirect).toHaveBeenCalledWith('query');
  });

  it('should render object results', async () => {
    const wrapper = render({
      confluenceClient: singleResultQuickNav(),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    assertSearchResultToHaveProperty('objectResults');
  });

  it('should render space results', async () => {
    const wrapper = render({
      crossProductSearchClient: singleResultCrossProductSearchClient(
        Scope.ConfluenceSpace,
      ),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    assertSearchResultToHaveProperty('spaceResults');
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

    assertSearchResultToHaveProperty('peopleResults');
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

    assertSearchResultToHaveProperty('objectResults');
    assertSearchResultToHaveProperty('spaceResults');
    assertSearchResultToHaveProperty('peopleResults');
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

    const objectResults = assertSearchResultToHaveProperty('objectResults');
    expect(objectResults[0].name).toBe('current result');
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
      assertResultError(true);
    });

    it('should clear error state after subsequent search', async () => {
      const searchMock = jest
        .fn()
        .mockImplementationOnce((query: string) => Promise.reject('error'))
        .mockImplementationOnce((query: string) => Promise.resolve(new Map()));

      const wrapper = render({
        confluenceClient: makeConfluenceClient({
          searchQuickNav: searchMock,
        }),
      });

      searchFor('error state', wrapper);
      await waitForRender(wrapper);

      assertResultError(true);

      searchFor('good state', wrapper);
      await waitForRender(wrapper);

      assertResultError(false);
    });

    it('should not show the error state when only people search fails', async () => {
      const wrapper = render({
        peopleSearchClient: errorPeopleSearchClient,
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(false);
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
