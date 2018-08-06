import * as React from 'react';
import { shallow } from 'enzyme';
import SearchResults, { Props } from '../../components/SearchResults';
import SearchError from '../../components/SearchError';

function render(partialProps: Partial<Props>) {
  const props = {
    query: '',
    isError: false,
    isLoading: false,
    retrySearch: () => {},
    keepPreQueryState: false,
    shouldRenderNoResultsState: () => false,
    renderPreQueryStateComponent: () => <div />,
    renderNoResultsStateComponent: () => <div />,
    renderSearchResultsStateComponent: () => <div />,
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
  const mockFn = jest.fn();
  const props: Partial<Props> = {
    query: '',
    isLoading: false,
    renderPreQueryStateComponent: mockFn,
  };

  render(props);
  expect(mockFn).toHaveBeenCalled();
});

it('should render pre query state while its loading and it should keep the previous state', () => {
  const mockFn = jest.fn();
  const props: Partial<Props> = {
    query: 'davo',
    isLoading: true,
    keepPreQueryState: true,
    renderPreQueryStateComponent: mockFn,
  };

  render(props);
  expect(mockFn).toHaveBeenCalled();
});

it('should render no results state when there are no results and a query is entered', () => {
  const mockFn = jest.fn();
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    keepPreQueryState: false,
    shouldRenderNoResultsState: () => true,
    renderNoResultsStateComponent: mockFn,
  };

  render(props);
  expect(mockFn).toHaveBeenCalled();
});

it('should render search results when there are results', () => {
  const mockFn = jest.fn();
  const props: Partial<Props> = {
    query: 'foo',
    isLoading: false,
    renderSearchResultsStateComponent: mockFn,
  };

  render(props);
  expect(mockFn).toHaveBeenCalled();
});
