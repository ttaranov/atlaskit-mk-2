import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import {
  HomeQuickSearchContainer,
  Props,
} from '../src/components/home/HomeQuickSearchContainer';
import { Result } from '../src/model/Result';
import GlobalQuickSearch from '../src/components/GlobalQuickSearch';
import { Scope } from '../src/api/CrossProductSearchClient';
import SearchError from '../src/components/SearchError';
import { delay, makeJiraObjectResult } from './_test-util';
import {
  noResultsPeopleSearchClient,
  errorPeopleSearchClient,
} from './mocks/_mockPeopleSearchClient';
import {
  noResultsCrossProductSearchClient,
  errorCrossProductSearchClient,
  singleResultCrossProductSearchClient,
  makeSingleResultCrossProductSearchResponse,
} from './mocks/_mockCrossProductSearchClient';
import {
  noResultsRecentSearchClient,
  errorRecentSearchClient,
} from './mocks/_mockRecentSearchClient';

function searchFor(query: string, wrapper: ShallowWrapper) {
  const quicksearch = wrapper.find(GlobalQuickSearch);
  const onSearchFn = quicksearch.prop('onSearch') as Function;
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

enum Group {
  Recent = 'recent',
  Jira = 'jira',
  Confluence = 'confluence',
  People = 'people',
}

function findGroup(group: Group, wrapper: ShallowWrapper) {
  return wrapper
    .find(ResultItemGroup)
    .findWhere(n => n.key() === group.valueOf());
}

function render(partialProps?: Partial<Props>) {
  const props: Props = {
    recentSearchClient: noResultsRecentSearchClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    ...partialProps,
  };

  return shallow<Props>(<HomeQuickSearchContainer {...props} />);
}

describe('HomeQuickSearchContainer', () => {
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

    it.skip('should unset loading state only when all promises have settled', async () => {
      /**
       * 0. Recent search errors out immediately, xpsearch takes 5ms
       * 1. Make sure immediately that loading state is set
       * 2. Wait 6ms until xpsearch has finished
       * 3. Make sure loading state is unset
       */
      const wrapper = render({
        recentSearchClient: errorRecentSearchClient,
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

  it('should render recent results', async () => {
    const wrapper = render({
      recentSearchClient: {
        search() {
          return Promise.resolve([makeJiraObjectResult()]);
        },
        getRecentItems() {
          return Promise.resolve([]);
        },
      },
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.Recent, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it('should render recently viewed items on mount', async () => {
    const mockRecentClient = {
      getRecentItems() {
        return Promise.resolve([makeJiraObjectResult()]);
      },
      search(query: string) {
        return Promise.resolve([]);
      },
    };

    const wrapper = render({
      recentSearchClient: mockRecentClient,
    });

    const onMount: Function = wrapper.find(GlobalQuickSearch).prop('onMount');
    onMount();

    await waitForRender(wrapper);

    const group = findGroup(Group.Recent, wrapper);
    expect(group.children()).toHaveLength(1);
  });

  it('should render jira results', async () => {
    const wrapper = render({
      crossProductSearchClient: singleResultCrossProductSearchClient(
        Scope.JiraIssue,
      ),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.Jira, wrapper);
    expect(group.children()).toHaveLength(2); // result + search jira item
  });

  it('should render confluence results', async () => {
    const wrapper = render({
      crossProductSearchClient: singleResultCrossProductSearchClient(
        Scope.ConfluencePageBlog,
      ),
    });

    searchFor('query', wrapper);
    await waitForRender(wrapper);

    const group = findGroup(Group.Confluence, wrapper);
    expect(group.children()).toHaveLength(2); // result + search conf item
  });

  it('should render people results', async () => {
    const wrapper = render({
      peopleSearchClient: {
        search() {
          return Promise.resolve([makeJiraObjectResult()]);
        },
        getRecentPeople() {
          return Promise.resolve([]);
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
     1. Delay recent search by 5ms
     2. Delay cross product search by 5ms
     3. Search
     4. Wait for 6ms (less than time for both searches combined)
     5. Make sure search results appeared in time
    */

    function searchRecent(query: string): Promise<Result[]> {
      return delay(5, [makeJiraObjectResult()]);
    }

    function searchCrossProduct(query: string): Promise<Map<Scope, Result[]>> {
      return delay(
        5,
        makeSingleResultCrossProductSearchResponse(Scope.JiraIssue),
      );
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

    const jiraResults = findGroup(Group.Jira, wrapper).children();
    const recentResults = findGroup(Group.Recent, wrapper).children();

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

    function searchDelayed(query: string): Promise<Map<Scope, Result[]>> {
      return delay(
        5,
        makeSingleResultCrossProductSearchResponse(
          Scope.JiraIssue,
          makeJiraObjectResult({ name: 'delayed result' }),
        ),
      );
    }

    function searchCurrent(query: string): Promise<Map<Scope, Result[]>> {
      return Promise.resolve(
        makeSingleResultCrossProductSearchResponse(
          Scope.JiraIssue,
          makeJiraObjectResult({ name: 'current result' }),
        ),
      );
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

    const jiraResults = findGroup(Group.Jira, wrapper).children();
    expect(jiraResults.first().prop('name')).toBe('current result');
  });

  describe('Analytics', () => {
    it('should log when a request fails', async () => {
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
          source: 'people',
        },
      );
    });
  });

  describe('Error handling', () => {
    it('should show error state when both recent search and xpsearch fails', async () => {
      const wrapper = render({
        recentSearchClient: errorRecentSearchClient,
        crossProductSearchClient: errorCrossProductSearchClient,
      });

      searchFor('dav', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(true);
    });

    it('should clear error state after subsequent search', async () => {
      const searchMock = jest
        .fn()
        .mockImplementationOnce((query: string) => Promise.reject('error'))
        .mockImplementationOnce((query: string) => Promise.resolve(new Map()));

      const mockSearchClient = {
        search: searchMock,
      };

      const wrapper = render({
        recentSearchClient: errorRecentSearchClient,
        crossProductSearchClient: mockSearchClient,
      });

      searchFor('error state', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(true);

      searchFor('good state', wrapper);
      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(false);
    });

    it('should not show the error state when getting the initial recently viewed items fails', async () => {
      const wrapper = render({
        recentSearchClient: errorRecentSearchClient,
      });

      await waitForRender(wrapper);
      expect(wrapper.find(SearchError).exists()).toBe(false);
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
