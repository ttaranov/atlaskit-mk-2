import * as React from 'react';
import { shallow } from 'enzyme';
import SearchResults, {
  Props,
} from '../../../components/common/GenericSearchResults';
import SearchError from '../../../components/SearchError';
import PreQueryState from '../../../components/common/PreQueryState';
import { PostQueryAnalyticsComponent } from '../../../components/common/ScreenAnalyticsHelper';
import ResultGroupsComponent, {
  ResultGroupType,
} from '../../../components/common/ResultGroupsComponent';
import { ResultType, AnalyticsType } from '../../../model/Result';

const defaultProps = {
  query: '',
  isError: false,
  isLoading: false,
  retrySearch: () => {},
  keepPreQueryState: false,
  searchSessionId: 'session_id',
  renderAdvancedSearchLink: () => <div id="advanced-search-link" />,
  renderNoResult: () => <div id="no-result" />,
  renderAdvancedSearchGroup: () => <div id="advanced-search-group" />,
  getRecentlyViewedGroups: () => [],
  getSearchResultsGroups: () => [],
};

const mockResultsGroup = [
  {
    items: [
      {
        resultId: 'id',
        name: 'result',
        href: 'http://www.jdog.jira-dev.com/link',
        resultType: ResultType.JiraObjectResult,
        analyticsType: AnalyticsType.RecentJira,
      },
    ],
    key: 'issues',
    titleI18nId: 'issues.key',
  },
];

function render(partialProps: Partial<Props>) {
  const props = {
    ...defaultProps,
    ...partialProps,
  };

  return shallow(<SearchResults {...props} />);
}

it('should render search error when there is an error', () => {
  const props: Partial<Props> = {
    isError: true,
  };

  const wrapper = render(props);
  expect(wrapper.find(SearchError).exists()).toBe(true);
});

it('should render nothing on initial load', () => {
  const props: Partial<Props> = {
    query: '',
    isLoading: true,
  };

  const wrapper = render(props);
  expect(wrapper.children().length).toBe(0);
});

it('should render pre query state when there is no query entered', () => {
  const mockFn = jest.fn(() => mockResultsGroup);
  const props: Partial<Props> = {
    query: '',
    isLoading: false,
    getRecentlyViewedGroups: mockFn,
  };

  const wrapper = render(props);
  expect(mockFn).toHaveBeenCalled();

  const preQueryState = wrapper.find(PreQueryState);
  expect(preQueryState.length).toBe(1);
  expect(preQueryState.props()).toMatchObject({
    query: '',
    renderAdvancedSearchLink: defaultProps.renderAdvancedSearchLink,
    searchSessionId: defaultProps.searchSessionId,
    renderAdvancedSearchGroup: defaultProps.renderAdvancedSearchGroup,
    resultsGroup: mockResultsGroup,
  });
});

it('should render pre query state while its loading and it should keep the previous state', () => {
  const mockFn = jest.fn();
  const props: Partial<Props> = {
    query: 'davo',
    isLoading: true,
    keepPreQueryState: true,
    getRecentlyViewedGroups: mockFn,
  };

  const wrapper = render(props);
  expect(mockFn).toHaveBeenCalled();

  const preQueryState = wrapper.find(PreQueryState);
  expect(preQueryState.length).toBe(1);
});

it('should render no results state when there are no results and a query is entered', () => {
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    keepPreQueryState: false,
    getSearchResultsGroups: jest.fn(() => [{ items: [] }]),
    renderNoResult: jest.fn(),
  };

  const wrapper = render(props);
  const postQueryAnalytics = wrapper.find(PostQueryAnalyticsComponent);

  expect(postQueryAnalytics.length).toBe(1);
  expect(postQueryAnalytics.props()).toMatchObject({
    searchSessionId: defaultProps.searchSessionId,
  });
  expect(props.getSearchResultsGroups).toHaveBeenCalled();
  expect(props.renderNoResult).toHaveBeenCalled();
});

it('should render search results when there are results', () => {
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    getSearchResultsGroups: jest.fn(() => mockResultsGroup),
  };

  const wrapper = render(props);
  const resultGroupsComponent = wrapper.find(ResultGroupsComponent);

  expect(props.getSearchResultsGroups).toHaveBeenCalled();
  expect(resultGroupsComponent.length).toBe(1);
  expect(resultGroupsComponent.props()).toMatchObject({
    type: ResultGroupType.PostQuery,
    renderAdvancedSearch: defaultProps.renderAdvancedSearchGroup,
    resultsGroup: mockResultsGroup,
    searchSessionId: defaultProps.searchSessionId,
  });
});
