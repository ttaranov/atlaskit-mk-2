import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import searchResults, {
  Props,
} from '../src/components/confluence/ConfluenceSearchResults';
import {
  ResultItemGroup,
  PersonResult,
  SpaceResult,
  ResultBase,
} from '@atlaskit/quick-search';
import { ResultType, Result } from '../src/model/Result';
import ObjectResult from '../src/components/ObjectResult';
import SearchError from '../src/components/SearchError';
import EmptyState from '../src/components/EmptyState';

enum Group {
  Objects = 'objects',
  Spaces = 'spaces',
  People = 'people',
}

function findGroup(group: Group, wrapper: ShallowWrapper) {
  return wrapper
    .find(ResultItemGroup)
    .findWhere(n => n.prop('test-selector') === group.valueOf());
}

function makeResult(partial?: Partial<Result>): Result {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    type: ResultType.Object,
    avatarUrl: 'avatarUrl',
    href: 'href',
    ...partial,
  };
}

describe('ConfluenceSearchResults', () => {
  function render(partialProps: Partial<Props>) {
    const props = {
      query: '',
      isError: false,
      retrySearch: () => {},
      recentlyViewedPages: [],
      recentlyViewedSpaces: [],
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
      ...partialProps,
    };

    return shallow(<div>{searchResults(props)}</div>);
  }

  it.skip('should render recently viewed objects when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyViewedPages: [makeResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    // TODO asssert
  });

  it.skip('should render recently viewed spaces when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyViewedSpaces: [makeResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    // TODO asssert
  });

  it.skip('should render objects when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      objectResults: [makeResult({ name: 'name' })],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    expect(group.prop('title')).toEqual('Pages, blogs, attachments');
    expect(group.find(ObjectResult).prop('name')).toEqual('name');
  });

  it.skip('should render spaces when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      spaceResults: [makeResult({ name: 'name' })],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    expect(group.prop('title')).toEqual('Spaces');
    expect(group.find(SpaceResult).prop('name')).toEqual('name');
  });

  it.skip('should render people results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      peopleResults: [makeResult({ type: ResultType.Person, name: 'name' })],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.prop('title')).toEqual('People');
    expect(group.find(PersonResult).prop('name')).toEqual('name');
  });

  it('should render search error when there is an error', () => {
    const props: Partial<Props> = {
      isError: true,
    };

    const wrapper = render(props);
    expect(wrapper.find(SearchError).exists()).toBe(true);
  });

  it('should render empty state when there are no results and a query is entered', () => {
    const props: Partial<Props> = {
      query: 'foo',
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
    };

    const wrapper = render(props);
    expect(wrapper.find(EmptyState).exists()).toBe(true);
  });
});
