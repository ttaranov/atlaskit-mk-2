import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import searchResults, { Props } from '../src/components/home/HomeSearchResults';
import { ResultItemGroup } from '@atlaskit/quick-search';
import {
  ObjectResultWithAnalytics,
  PersonResultWithAnalytics,
} from '../src/components/SearchResultsUtil';
import SearchError from '../src/components/SearchError';
import NoResults from '../src/components/NoResults';
import AdvancedSearchResult from '../src/components/AdvancedSearchResult';
import {
  makeJiraObjectResult,
  makeConfluenceObjectResult,
  makePersonResult,
} from './_test-util';

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

describe('HomeSearchResults', () => {
  function render(partialProps: Partial<Props>) {
    const props = {
      query: '',
      isError: false,
      retrySearch: () => {},
      recentlyViewedItems: [],
      recentResults: [],
      jiraResults: [],
      confluenceResults: [],
      peopleResults: [],
      ...partialProps,
    };

    return shallow(<div>{searchResults(props)}</div>);
  }

  it('should render recently viewed items when no query is entered', () => {
    const props = {
      query: '',
      recentlyViewedItems: [makeJiraObjectResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Recent, wrapper);

    expect(group.prop('title')).toEqual('Recently viewed');
    expect(group.find(ObjectResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should only show the recently viewed group when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyViewedItems: [makeJiraObjectResult()],
    };

    const wrapper = render(props);

    const groups = wrapper.find(ResultItemGroup);
    expect(groups).toHaveLength(1);
  });

  it('should render recent results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      recentResults: [makeJiraObjectResult({ name: 'name' })],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Recent, wrapper);

    expect(group.prop('title')).toEqual('Recently viewed');
    expect(group.find(ObjectResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should render jira results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      jiraResults: [makeJiraObjectResult({ name: 'name' })],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Jira, wrapper);

    expect(group.prop('title')).toEqual('Jira issues');
    expect(group.find(ObjectResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should render confluence results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      confluenceResults: [makeConfluenceObjectResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Confluence, wrapper);

    expect(group.prop('title')).toEqual('Confluence pages and blogs');
    expect(group.find(ObjectResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should render people results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      peopleResults: [makePersonResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.prop('title')).toEqual('People');
    expect(group.find(PersonResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should render a jira result item to search jira', () => {
    const props: Partial<Props> = {
      query: 'na',
      jiraResults: [makeJiraObjectResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Jira, wrapper);

    expect(group.prop('title')).toEqual('Jira issues');
    expect(group.find(AdvancedSearchResult).prop('resultId')).toEqual(
      'search_jira',
    );
  });

  it('should render a confluence result item to search confluence', () => {
    const props: Partial<Props> = {
      query: 'na',
      confluenceResults: [makeConfluenceObjectResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Confluence, wrapper);

    expect(group.prop('title')).toEqual('Confluence pages and blogs');
    expect(group.find(AdvancedSearchResult).prop('resultId')).toEqual(
      'search_confluence',
    );
  });

  it('should render a people result item to search people', () => {
    const props: Partial<Props> = {
      query: 'na',
      peopleResults: [makePersonResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.prop('title')).toEqual('People');
    expect(group.find(AdvancedSearchResult).prop('resultId')).toEqual(
      'search_people',
    );
  });

  it('should not render recent results group when there are no recent results', () => {
    const props: Partial<Props> = {
      query: 'aslfkj',
      recentResults: [],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Recent, wrapper);
    expect(group.exists()).toBe(false);
  });

  it('should render search error when there is an error', () => {
    const props: Partial<Props> = {
      isError: true,
    };

    const wrapper = render(props);
    expect(wrapper.find(SearchError).exists()).toBe(true);
  });

  it('should render no results state when there are no results and a query is entered', () => {
    const props: Partial<Props> = {
      query: 'foo',
      recentResults: [],
      jiraResults: [],
      confluenceResults: [],
      peopleResults: [],
    };

    const wrapper = render(props);
    expect(wrapper.find(NoResults).exists()).toBe(true);

    // assert advanced search links are there
    ['search_jira', 'search_confluence', 'search_people'].forEach(resultId => {
      expect(
        wrapper
          .find(AdvancedSearchResult)
          .findWhere(wrapper => wrapper.prop('resultId') === resultId)
          .exists(),
      ).toBe(true);
    });
  });
});
