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
  handlePromiseError,
} from '../src/components/SearchResultsUtil';
import {
  JiraObjectResult,
  ContainerResult,
  ConfluenceObjectResult,
  PersonResult,
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
      showKeyboardLozenge: false,
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
    const jiraResults: JiraObjectResult[] = [
      makeJiraObjectResult({
        resultId: 'resultId',
      }),
    ];

    const wrapper = shallow(<span>{renderResults(jiraResults)}</span>);

    expect(wrapper.find(ObjectResultWithAnalytics).props()).toEqual({
      href: 'href',
      resultId: 'resultId',
      type: 'result-jira',
      objectKey: 'objectKey',
      avatarUrl: 'avatarUrl',
      name: 'name',
      containerName: 'containerName',
    });
  });

  it('should pass the correct properties to PersonResult for people results', () => {
    const peopleResults: PersonResult[] = [
      makePersonResult({
        resultId: 'resultId',
        analyticsType: AnalyticsType.ResultPerson,
      }),
    ];

    const wrapper = shallow(<span>{renderResults(peopleResults)}</span>);

    expect(wrapper.find(PersonResultWithAnalytics).props()).toEqual({
      href: 'href',
      resultId: 'resultId',
      type: 'result-person',
      avatarUrl: 'avatarUrl',
      name: 'name',
      mentionName: 'mentionName',
      presenceMessage: 'presenceMessage',
    });
  });

  it('should pass the correct properties to ObjectResult for Confluence results', () => {
    const confluenceResults: ConfluenceObjectResult[] = [
      makeConfluenceObjectResult({
        resultId: 'resultId',
        analyticsType: AnalyticsType.ResultConfluence,
      }),
    ];

    const wrapper = shallow(<span>{renderResults(confluenceResults)}</span>);

    expect(wrapper.find(ObjectResultWithAnalytics).props()).toEqual({
      href: 'href',
      resultId: 'resultId',
      type: 'result-confluence',
      name: 'name',
      containerName: 'containerName',
      contentType: ContentType.ConfluencePage,
    });
  });

  it('should pass the correct properties to ContainerResult for Confluence spaces', () => {
    const confluenceSpaceResults: ContainerResult[] = [
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
      resultId: 'resultId',
      type: 'result-confluence',
      avatarUrl: 'avatarUrl',
      name: 'name',
    });
  });

  describe('handlePromiseError', () => {
    it('should do nothing when promise is resolved', () => {
      const promiseValue = 10;
      const promise = Promise.resolve(promiseValue);
      const errorHandlerMock = jest.fn();
      const defaultValue = 80;

      return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
        value => {
          expect(value).toBe(promiseValue);
          expect(errorHandlerMock.mock.calls.length).toBe(0);
        },
      );
    });

    it('should use default value when promise is rejected', () => {
      const promise = Promise.reject(new Error('err'));
      const errorHandlerMock = jest.fn();
      const defaultValue = 80;

      return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
        value => {
          expect(value).toBe(defaultValue);
          expect(errorHandlerMock.mock.calls.length).toBe(1);
        },
      );
    });

    it('should not throw exception', () => {
      const promise = Promise.reject(new Error('err'));
      const errorHandlerMock = () => {
        throw new Error('new error');
      };
      const defaultValue = 80;

      return handlePromiseError(promise, defaultValue, errorHandlerMock)
        .then(value => {
          expect(value).toBe(defaultValue);
        })
        .catch(error => {
          throw new Error(
            'should never throw exception and never reach the catch block',
          );
        });
    });
  });
});
