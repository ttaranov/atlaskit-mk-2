import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeConfluenceClient,
} from '../mocks/_mockConfluenceClient';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
} from '../../../components/common/QuickSearchContainer';
import {
  makeConfluenceObjectResult,
  makePersonResult,
  makeConfluenceContainerResult,
} from '../_test-util';
import SearchResultsComponent, {
  Props as SearchResultsComponentProps,
} from '../../../components/common/SearchResults';
import { SearchScreenCounter } from '../../../util/ScreenCounter';
import NoResultsState from '../../../components/confluence/NoResultsState';
import AdvancedSearchGroup from '../../../components/confluence/AdvancedSearchGroup';
import * as SearchResultUtils from '../../../components/SearchResultsUtil';
import { Scope } from '../../../api/types';
import { Result } from '../../../model/Result';
import {
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  SearchSession,
} from '../../../api/CrossProductSearchClient';
import { mockLogger } from '../mocks/_mockLogger';

const sessionId = 'sessionId';
function render(partialProps?: Partial<Props>) {
  const logger = mockLogger();
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    useAggregatorForConfluenceObjects: false,
    useCPUSForPeopleResults: false,
    logger,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
}

describe('ConfluenceQuickSearchContainer', () => {
  it('should render QuickSearchContainer with correct props', () => {
    const wrapper = render();
    const quickSearchContainer = wrapper.find(QuickSearchContainer);

    const props = quickSearchContainer.props();
    expect(props).toHaveProperty('getSearchResultsComponent');
  });

  it('should return recent viewed items', async () => {
    const mockConfluenceClient = makeConfluenceClient({
      getRecentItems() {
        return Promise.resolve([makeConfluenceObjectResult()]);
      },
    });

    const wrapper = render({
      confluenceClient: mockConfluenceClient,
    });
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const recentItems = await (quickSearchContainer.props() as QuickSearchContainerProps).getRecentItems(
      sessionId,
    );
    expect(recentItems).toMatchObject({
      results: {
        objects: [
          {
            analyticsType: 'result-confluence',
            resultType: 'confluence-object-result',
            containerName: 'containerName',
            contentType: 'confluence-page',
            containerId: 'containerId',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
          },
        ],
        spaces: [],
        people: [],
      },
    });
  });

  it('should return search result', async () => {
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

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
    );

    expect(searchResults).toMatchObject({
      results: {
        objects: [],
        spaces: [],
        people: [
          {
            mentionName: 'mentionName',
            presenceMessage: 'presenceMessage',
            analyticsType: 'result-person',
            resultType: 'person-result',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
          },
        ],
      },
      // assert search performance timings
      timings: {
        quickNavElapsedMs: expect.any(Number),
        confSearchElapsedMs: expect.any(Number),
        peopleElapsedMs: expect.any(Number),
      },
    });
  });

  it('should use CPUs for people results when enabled', async () => {
    const wrapper = render({
      useCPUSForPeopleResults: true,
      crossProductSearchClient: {
        search(query: string, searchSession: SearchSession, scopes: Scope[]) {
          // only return items when People scope is set
          if (scopes.find(s => s === Scope.People)) {
            const results = new Map<Scope, Result[]>();
            results.set(Scope.People, [makePersonResult()]);

            return Promise.resolve({
              results: results,
            });
          }

          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
    );

    expect(searchResults.results.people).toEqual([
      {
        mentionName: 'mentionName',
        presenceMessage: 'presenceMessage',
        analyticsType: 'result-person',
        resultType: 'person-result',
        name: 'name',
        avatarUrl: 'avatarUrl',
        href: 'href',
        resultId: expect.any(String),
      },
    ]);
  });

  describe('Confluence Search Results component', () => {
    let searchResultsComponent;
    let getAdvancedSearchUrlSpy;
    let recentlyInteractedPeople;
    let spaceResults;
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

    const getProps = (): SearchResultsComponentProps => {
      const { props = {} as SearchResultsComponentProps } =
        (searchResultsComponent as React.ReactElement<Props>) || {};
      return props as SearchResultsComponentProps;
    };

    beforeEach(() => {
      getAdvancedSearchUrlSpy = jest.spyOn(
        SearchResultUtils,
        'getConfluenceAdvancedSearchLink',
      );
      getAdvancedSearchUrlSpy.mockReturnValue('confUrl');
      const quickSearchContainer = wrapper.find(QuickSearchContainer);
      spaceResults = [makeConfluenceContainerResult()];
      recentlyInteractedPeople = [makePersonResult()];
      searchResultsComponent = (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResultsComponent(
        {
          retrySearch: jest.fn(),
          latestSearchQuery: 'query',
          isError: false,
          searchResults: {
            objects: [],
            spaces: spaceResults,
          },
          isLoading: false,
          recentItems: {
            objects: [],
            spaces: [],
            people: recentlyInteractedPeople,
          },
          keepPreQueryState: false,
          searchSessionId: sessionId,
        },
      );
    });

    afterEach(() => {
      getAdvancedSearchUrlSpy.mockRestore();
    });

    it('should has expected props and type', () => {
      const { type = '', props = {} } =
        (searchResultsComponent as React.ReactElement<Props>) || {};
      expect(type).toBe(SearchResultsComponent);
      expect(props).toMatchObject({
        query: 'query',
        isError: false,
        isLoading: false,
        keepPreQueryState: false,
        searchSessionId: 'sessionId',
        preQueryScreenCounter: expect.any(SearchScreenCounter),
        postQueryScreenCounter: expect.any(SearchScreenCounter),
      });
    });

    it('should renderNoResult component', () => {
      const { renderNoResult } = getProps();
      const noResultState = renderNoResult();
      const { type = '', props = {} } =
        (noResultState as React.ReactElement<Props>) || {};

      expect(type).toBe(NoResultsState);
      expect(props).toMatchObject({
        query: 'query',
      });
    });

    it('should renderNoRecentActivity', () => {
      const { renderNoRecentActivity } = getProps();
      const noRecentActivity = renderNoRecentActivity();
      const { type = '', props = {} } =
        (noRecentActivity as React.ReactElement<Props>) || {};
      expect(type).toBe(FormattedHTMLMessage);
      expect(props).toMatchObject({
        id: 'global-search.no-recent-activity-body',
        values: { url: 'confUrl' },
      });
    });

    it('should renderAdvancedSearchGroup', () => {
      const { renderAdvancedSearchGroup } = getProps();
      const analyticsData = { resultsCount: 10 };
      const advancedSearchGroup = renderAdvancedSearchGroup(analyticsData);
      const { type = '', props = {} } =
        (advancedSearchGroup as React.ReactElement<Props>) || {};
      expect(type).toBe(AdvancedSearchGroup);
      expect(props).toMatchObject({
        analyticsData,
        query: 'query',
      });
    });

    it('should return preQueryGroups', () => {
      const { getPreQueryGroups } = getProps();
      const preQueryGroups = getPreQueryGroups();

      expect(preQueryGroups).toMatchObject([
        {
          items: [],
          key: 'objects',
          titleI18nId: 'global-search.confluence.recent-pages-heading',
        },
        {
          items: [],
          key: 'spaces',
          titleI18nId: 'global-search.confluence.recent-spaces-heading',
        },
        {
          items: recentlyInteractedPeople,
          titleI18nId: 'global-search.people.recent-people-heading',
          key: 'people',
        },
      ]);
    });

    it('should return postQueryGroups', () => {
      const { getPostQueryGroups } = getProps();
      const postQueryGroups = getPostQueryGroups();
      expect(postQueryGroups).toMatchObject([
        {
          items: [],
          key: 'objects',
          titleI18nId: 'global-search.confluence.confluence-objects-heading',
        },
        {
          items: spaceResults,
          key: 'spaces',
          titleI18nId: 'global-search.confluence.spaces-heading',
        },
        {
          items: [],
          titleI18nId: 'global-search.people.people-heading',
          key: 'people',
        },
      ]);
    });
  });
});
