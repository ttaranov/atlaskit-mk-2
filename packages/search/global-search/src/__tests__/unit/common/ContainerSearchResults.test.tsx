import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import * as uuid from 'uuid/v4';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import {
  JiraQuickSearchContainer,
  Props as JiraProps,
} from '../../../components/jira/JiraQuickSearchContainer';
import {
  ConfluenceQuickSearchContainer,
  Props as ConfluenceProps,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';

import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
  SearchResultProps,
} from '../../../components/common/QuickSearchContainer';
import { noResultsConfluenceClient } from '../mocks/_mockConfluenceClient';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import { mockLogger } from '../mocks/_mockLogger';
import { mockNoResultJiraClient } from '../mocks/_mockJiraClient';
import {
  makeJiraObjectResult,
  makePersonResult,
  makeConfluenceContainerResult,
} from '../_test-util';
import { ContentType } from '../../../model/Result';
import * as SearchResultUtils from '../../../components/SearchResultsUtil';
import SearchResultsComponent, {
  Props as SearchResultsComponentProps,
} from '../../../components/common/SearchResults';
import { SearchScreenCounter } from '../../../util/ScreenCounter';
import JiraNoResultsState from '../../../components/jira/NoResultsState';
import ConfluenceNoResultsState from '../../../components/confluence/NoResultsState';
import ConfluenceAdvancedSearchGroup from '../../../components/confluence/AdvancedSearchGroup';
import JiraAdvancedSearchGroup from '../../../components/jira/JiraAdvancedSearch';
import StickyFooter from '../../../components/common/StickyFooter';

const issues = [
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
];
const boards = [
  makeJiraObjectResult({
    contentType: ContentType.JiraBoard,
  }),
];
const spaceResults = [makeConfluenceContainerResult()];
const recentlyInteractedPeople = [makePersonResult()];

const logger = mockLogger();
const createAnalyticsEventSpy = jest.fn();
const renderJiraQuickSearchContainer = (props: JiraProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<JiraQuickSearchContainer {...props} />);
};

const renderConfluenceQuickSearchContainer = (props: ConfluenceProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
};

const renderComponent = product => {
  const props = {
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    jiraClient: mockNoResultJiraClient(),
    logger,
    createAnalyticsEvent: createAnalyticsEventSpy,
    confluenceClient: noResultsConfluenceClient,
    useAggregatorForConfluenceObjects: false,
    useCPUSForPeopleResults: false,
  };
  return product === 'jira'
    ? renderJiraQuickSearchContainer(props)
    : renderConfluenceQuickSearchContainer(props);
};

const getNoResultsState = product =>
  product === 'jira' ? JiraNoResultsState : ConfluenceNoResultsState;

const assertJiraNoRecentActivity = (type, props) => {
  expect(type).toEqual(React.Fragment);
  const formattedMessage = props.children[0];
  expect(formattedMessage).toMatchObject({
    type: FormattedHTMLMessage,
    props: {
      id: 'global-search.jira.no-recent-activity-body',
    },
  });

  const advancedSearchSection = props.children[1].props.children;
  expect(advancedSearchSection).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      query: 'query',
      analyticsData: { resultsCount: 0, wasOnNoResultsScreen: true },
      showKeyboardLozenge: false,
      showSearchIcon: false,
    },
  });
};

const assertConfluenceNoRecentActivity = (type, props) => {
  expect(type).toBe(FormattedHTMLMessage);
  expect(props).toMatchObject({
    id: 'global-search.no-recent-activity-body',
    values: { url: '/wiki/dosearchsite.action' },
  });
};
const assertNoRecentActivityComponent = (product, type, props) => {
  if (product === 'jira') {
    assertJiraNoRecentActivity(type, props);
  } else {
    assertConfluenceNoRecentActivity(type, props);
  }
};

const assertJiraAdvancedSearchGroup = (type, props) => {
  expect(type).toEqual(StickyFooter);
  expect(props.children).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      analyticsData: { resultsCount: 10 },
      query: 'query',
      showKeyboardLozenge: true,
      showSearchIcon: true,
      onAdvancedSearchChange: expect.any(Function),
    },
  });
};

const assertConfluenceAdvancedSearchGroup = (type, props) => {
  const analyticsData = { resultsCount: 10 };
  expect(type).toBe(ConfluenceAdvancedSearchGroup);
  expect(props).toMatchObject({
    analyticsData,
    query: 'query',
  });
};
const assertAdvancedSearchGroup = (product, type, props) => {
  if (product === 'jira') {
    assertJiraAdvancedSearchGroup(type, props);
  } else {
    assertConfluenceAdvancedSearchGroup(type, props);
  }
};

const getSearchAndRecentItems = (product, sessionId): SearchResultProps => {
  const commonProps = {
    retrySearch: jest.fn(),
    latestSearchQuery: 'query',
    isError: false,
    isLoading: false,
    keepPreQueryState: false,
    searchSessionId: sessionId,
  };
  if (product === 'jira') {
    return {
      ...commonProps,
      searchResults: {
        objects: issues,
        containers: boards,
      },
      recentItems: {
        objects: [],
        containers: [],
        people: recentlyInteractedPeople,
      },
    };
  }
  return {
    ...commonProps,
    searchResults: {
      objects: [],
      spaces: spaceResults,
    },
    recentItems: {
      objects: [],
      spaces: [],
      people: recentlyInteractedPeople,
    },
  };
};

const getJiraPreqQueryResults = () => [
  {
    items: [],
    key: 'issues',
    titleI18nId: 'global-search.jira.recent-issues-heading',
  },
  {
    items: [],
    key: 'containers',
    titleI18nId: 'global-search.jira.recent-containers',
  },
  {
    items: recentlyInteractedPeople,
    titleI18nId: 'global-search.jira.recent-people-heading',
    key: 'people',
  },
];
const getConfluencePreQueryResults = () => [
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
];

const getJiraPostQueryResults = () => [
  {
    items: issues,
    key: 'issues',
    titleI18nId: 'global-search.jira.seach-result-issues-heading',
  },
  {
    items: boards,
    key: 'containers',
    titleI18nId: 'global-search.jira.seach-result-containers-heading',
  },
  {
    items: [],
    titleI18nId: 'global-search.jira.seach-result-people-heading',
    key: 'people',
  },
];
const getConfluencePostQueryResults = () => [
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
];

const getPostQueryResults = product =>
  product === 'jira'
    ? getJiraPostQueryResults()
    : getConfluencePostQueryResults();
const getPreqQueryResults = product =>
  product === 'jira'
    ? getJiraPreqQueryResults()
    : getConfluencePreQueryResults();

['confluence', 'jira'].forEach(product => {
  describe(`${product} SearchResultsComponent`, () => {
    let searchResultsComponent;
    let getAdvancedSearchUrlSpy;
    const wrapper = renderComponent(product);
    const getProps = (): SearchResultsComponentProps => {
      const { props = {} as SearchResultsComponentProps } =
        (searchResultsComponent as React.ReactElement<
          SearchResultsComponentProps
        >) || {};
      return props as SearchResultsComponentProps;
    };

    let sessionId;
    beforeEach(() => {
      sessionId = uuid();
      getAdvancedSearchUrlSpy = jest.spyOn(
        SearchResultUtils,
        'getJiraAdvancedSearchUrl',
      );
      getAdvancedSearchUrlSpy.mockReturnValue('confUrl');
      const quickSearchContainer = wrapper.find(QuickSearchContainer);
      searchResultsComponent = (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResultsComponent(
        getSearchAndRecentItems(product, sessionId),
      );
    });

    afterEach(() => {
      getAdvancedSearchUrlSpy.mockRestore();
    });

    it('should has expected props and type', () => {
      const { type = '', props = {} } =
        (searchResultsComponent as React.ReactElement<
          SearchResultsComponentProps
        >) || {};
      expect(type).toBe(SearchResultsComponent);
      expect(props).toMatchObject({
        query: 'query',
        isError: false,
        isLoading: false,
        keepPreQueryState: false,
        searchSessionId: sessionId,
        preQueryScreenCounter: expect.any(SearchScreenCounter),
        postQueryScreenCounter: expect.any(SearchScreenCounter),
      });
    });

    it('should renderNoResult component', () => {
      const { renderNoResult } = getProps();
      const noResultState = renderNoResult();
      const { type = '', props = {} } =
        (noResultState as React.ReactElement<SearchResultsComponentProps>) ||
        {};

      expect(type).toBe(getNoResultsState(product));
      expect(props).toMatchObject({
        query: 'query',
      });
    });

    it('should renderNoRecentActivity', () => {
      const { renderNoRecentActivity } = getProps();
      const noRecentActivity = renderNoRecentActivity();
      const { type = '', props = {} } =
        (noRecentActivity as React.ReactElement<SearchResultsComponentProps>) ||
        {};
      assertNoRecentActivityComponent(product, type, props);
    });

    it('should renderAdvancedSearchGroup', () => {
      const { renderAdvancedSearchGroup } = getProps();
      const analyticsData = { resultsCount: 10 };
      const advancedSearchGroup = renderAdvancedSearchGroup(analyticsData);
      const { type = '', props = {} } =
        (advancedSearchGroup as React.ReactElement<
          SearchResultsComponentProps
        >) || {};
      assertAdvancedSearchGroup(product, type, props);
    });

    it('should return preQueryGroups', () => {
      const { getPreQueryGroups } = getProps();
      const preQueryGroups = getPreQueryGroups();

      expect(preQueryGroups).toMatchObject(getPreqQueryResults(product));
    });

    it('should return postQueryGroups', () => {
      const { getPostQueryGroups } = getProps();
      const postQueryGroups = getPostQueryGroups();
      expect(postQueryGroups).toMatchObject(getPostQueryResults(product));
    });
  });
});
