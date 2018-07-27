import * as React from 'react';
import { shallow } from 'enzyme';
import HomeSearchResults, {
  Props,
} from '../../../components/home/HomeSearchResults';
import SearchError from '../../../components/SearchError';
import { makeConfluenceObjectResult } from '../_test-util';
import PreQueryState from '../../../components/home/PreQueryState';
import NoResultsState from '../../../components/home/NoResultsState';
import SearchResultsState from '../../../components/home/SearchResultsState';

function render(partialProps: Partial<Props>) {
  const props = {
    query: '',
    isError: false,
    isLoading: false,
    retrySearch: () => {},
    recentlyViewedItems: [],
    recentResults: [],
    jiraResults: [],
    confluenceResults: [],
    peopleResults: [],
    ...partialProps,
  };

  return shallow(<HomeSearchResults {...props} />);
}

it('should render search error when there is an error', () => {
  const props: Partial<Props> = {
    isError: true,
  };

  const wrapper = render(props);
  expect(wrapper.find(SearchError).exists()).toBe(true);
});

it('should render pre query state when there is no query entered', () => {
  const props: Partial<Props> = {
    query: '',
  };

  const wrapper = render(props);
  expect(wrapper.find(PreQueryState).exists()).toBe(true);
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
  expect(wrapper.find(NoResultsState).exists()).toBe(true);
});

it('should render search results when there are results', () => {
  const props: Partial<Props> = {
    query: 'foo',
    recentResults: [makeConfluenceObjectResult()],
    peopleResults: [],
  };

  const wrapper = render(props);
  expect(wrapper.find(SearchResultsState).exists()).toBe(true);
});
