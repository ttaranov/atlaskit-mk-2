import * as React from 'react';
import { shallow } from 'enzyme';
import ConfluenceSearchResults, {
  Props,
} from '../../components/confluence/ConfluenceSearchResults';

import SearchError from '../../components/SearchError';
import {
  makeConfluenceContainerResult,
  makeConfluenceObjectResult,
} from './_test-util';
import PreQueryState from '../../components/confluence/PreQueryState';
import NoResultsState from '../../components/confluence/NoResultsState';
import SearchResultsState from '../../components/confluence/SearchResultsState';

function render(partialProps: Partial<Props>) {
  const props = {
    query: '',
    isError: false,
    isLoading: false,
    retrySearch: () => {},
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
    keepPreQueryState: false,
    searchSessionId: 'abc',
    ...partialProps,
  };

  return shallow(<ConfluenceSearchResults {...props} />);
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
  const props: Partial<Props> = {
    query: '',
    isLoading: false,
  };

  const wrapper = render(props);
  expect(wrapper.find(PreQueryState).exists()).toBe(true);
});

it('should render pre query state while its loading and it should keep the previous state', () => {
  const props: Partial<Props> = {
    query: 'davo',
    isLoading: true,
    keepPreQueryState: true,
    recentlyViewedPages: [makeConfluenceObjectResult()],
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
  };

  const wrapper = render(props);
  expect(wrapper.find(PreQueryState).exists()).toBe(true);
  expect(wrapper.find(PreQueryState).prop('recentlyViewedPages')).toHaveLength(
    1,
  );
});

it('should render no results state when there are no results and a query is entered', () => {
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    keepPreQueryState: false,
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
  };

  const wrapper = render(props);
  expect(wrapper.find(NoResultsState).exists()).toBe(true);
});

it('should render search results when there are results', () => {
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    objectResults: [makeConfluenceObjectResult()],
    spaceResults: [makeConfluenceContainerResult()],
    peopleResults: [],
  };

  const wrapper = render(props);
  expect(wrapper.find(SearchResultsState).exists()).toBe(true);
});
