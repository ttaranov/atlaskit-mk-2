import * as React from 'react';
import { shallow } from 'enzyme';
import {
  searchPeopleItem,
  searchConfluenceItem,
  AdvancedSearchItemProps,
  searchJiraItem,
  renderResults,
  ObjectResultWithAnalytics,
  PersonResultWithAnalytics,
  ContainerResultWithAnalytics,
} from '../src/components/SearchResultsUtil';
import {
  GlobalSearchJiraObjectResult,
  GlobalSearchContainerResult,
  GlobalSearchConfluenceObjectResult,
  GlobalSearchPersonResult,
  AnalyticsType,
  ContentType,
} from '../src/model/Result';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
  makeJiraObjectResult,
} from './_test-util';

describe('searchPeopleItem', () => {
  function render(partialProps: Partial<AdvancedSearchItemProps>) {
    const props: AdvancedSearchItemProps = {
      query: 'query',
      icon: <div />,
      text: 'text',
      ...partialProps,
    };

    return shallow(searchPeopleItem(props));
  }

  it('should render the text', () => {
    const wrapper = render({ text: 'cucumber' });
    expect(wrapper.prop('text')).toEqual('cucumber');
  });

  it('should render the icon', () => {
    const wrapper = render({ icon: <span /> });
    expect(wrapper.prop('icon')).toEqual(<span />);
  });

  it('should append the url encoded query', () => {
    const wrapper = render({ query: 'test query' });
    expect(wrapper.prop('href')).toEqual('/people/search?q=test%20query');
  });
});

describe('searchConfluenceItem', () => {
  function render(partialProps: Partial<AdvancedSearchItemProps>) {
    const props: AdvancedSearchItemProps = {
      query: 'query',
      icon: <div />,
      text: 'text',
      ...partialProps,
    };

    return shallow(searchConfluenceItem(props));
  }

  it('should render the text', () => {
    const wrapper = render({ text: 'cucumber' });
    expect(wrapper.prop('text')).toEqual('cucumber');
  });

  it('should render the icon', () => {
    const wrapper = render({ icon: <span /> });
    expect(wrapper.prop('icon')).toEqual(<span />);
  });

  it('should append the url encoded query', () => {
    const wrapper = render({ query: 'test query' });
    expect(wrapper.prop('href')).toEqual(
      '/wiki/dosearchsite.action?queryString=test%20query',
    );
  });
});

describe('searchJiraItem', () => {
  function render(query: string) {
    return shallow(searchJiraItem(query));
  }

  it('should append the url encoded query', () => {
    const wrapper = render('test query');
    expect(wrapper.prop('href')).toEqual(
      '/issues/?jql=text%20~%20%22test%20query%22',
    );
  });
});

describe('renderResults', () => {
  it('should pass the correct properties to ObjectResult for Jira results', () => {
    const jiraResults: GlobalSearchJiraObjectResult[] = [
      makeJiraObjectResult({
        resultId: 'resultId',
      }),
    ];

    const wrapper = shallow(<span>{renderResults(jiraResults)}</span>);

    expect(wrapper.find(ObjectResultWithAnalytics).props()).toEqual({
      href: 'href',
      type: 'result-jira',
      objectKey: 'objectKey',
      avatarUrl: 'avatarUrl',
      name: 'name',
      containerName: 'containerName',
    });
  });

  it('should pass the correct properties to PersonResult for people results', () => {
    const peopleResults: GlobalSearchPersonResult[] = [
      makePersonResult({
        resultId: 'resultId',
        analyticsType: AnalyticsType.ResultPerson,
      }),
    ];

    const wrapper = shallow(<span>{renderResults(peopleResults)}</span>);

    expect(wrapper.find(PersonResultWithAnalytics).props()).toEqual({
      href: 'href',
      type: 'result-person',
      avatarUrl: 'avatarUrl',
      name: 'name',
    });
  });

  it('should pass the correct properties to ObjectResult for Confluence results', () => {
    const confluenceResults: GlobalSearchConfluenceObjectResult[] = [
      makeConfluenceObjectResult({
        resultId: 'resultId',
        analyticsType: AnalyticsType.ResultConfluence,
      }),
    ];

    const wrapper = shallow(<span>{renderResults(confluenceResults)}</span>);

    expect(wrapper.find(ObjectResultWithAnalytics).props()).toEqual({
      href: 'href',
      type: 'result-confluence',
      name: 'name',
      containerName: 'containerName',
      contentType: ContentType.ConfluencePage,
    });
  });

  it('should pass the correct properties to ContainerResult for Confluence spaces', () => {
    const confluenceSpaceResults: GlobalSearchContainerResult[] = [
      makeConfluenceContainerResult({
        resultId: 'resultId',
        analyticsType: AnalyticsType.ResultConfluence,
      }),
    ];

    const wrapper = shallow(
      <span>{renderResults(confluenceSpaceResults)}</span>,
    );

    expect(wrapper.find(ContainerResultWithAnalytics).props()).toEqual({
      href: 'href',
      type: 'result-confluence',
      avatarUrl: 'avatarUrl',
      name: 'name',
    });
  });
});
