import * as React from 'react';
import { shallow } from 'enzyme';
import {
  searchPeopleItem,
  searchConfluenceItem,
  AdvancedSearchItemProps,
  searchJiraItem,
  renderResults,
} from '../src/components/SearchResultsUtil';
import {
  Result,
  ResultType,
  AnalyticsType,
  ResultContentType,
} from '../src/model/Result';
import { ObjectResultWithAnalytics } from '../src/components/SearchResultsUtil';

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

  describe('renderResults', () => {
    it('should pass the required properties to the Result component', () => {
      const result: Result = {
        resultId: 'resultId',
        resultType: ResultType.Object,
        analyticsType: AnalyticsType.RecentConfluence,
        name: 'name',
        containerName: 'containerName',
        href: 'href',
        avatarUrl: 'avatarUrl',
        objectKey: 'objectKey',
        contentType: ResultContentType.Page,
      };

      const wrapper = shallow(<span>{renderResults([result])}</span>);
      const resultComponent = wrapper.find(ObjectResultWithAnalytics);

      expect(resultComponent.prop('resultId')).toEqual('resultId');
      expect(resultComponent.prop('type')).toEqual('recent-confluence');
      expect(resultComponent.prop('name')).toEqual('name');
      expect(resultComponent.prop('containerName')).toEqual('containerName');
      expect(resultComponent.prop('href')).toEqual('href');
      expect(resultComponent.prop('avatarUrl')).toEqual('avatarUrl');
      expect(resultComponent.prop('objectKey')).toEqual('objectKey');
      expect(resultComponent.prop('contentType')).toEqual('page');
    });
  });
});
