import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import searchResults, {
  Props,
} from '../src/components/confluence/ConfluenceSearchResults';
import {
  ResultItemGroup,
  PersonResult,
  ContainerResult,
  ResultBase,
} from '@atlaskit/quick-search';
import {
  ObjectResultWithAnalytics,
  ContainerResultWithAnalytics,
  PersonResultWithAnalytics,
} from '../src/components/SearchResultsUtil';
import SearchError from '../src/components/SearchError';
import NoResults from '../src/components/NoResults';
import {
  makeConfluenceContainerResult,
  makeConfluenceObjectResult,
  makePersonResult,
} from './_test-util';
import { ContentType, ResultType } from '../src/model/Result';

enum Group {
  Objects = 'objects',
  Spaces = 'spaces',
  People = 'people',
}

function findGroup(group: Group, wrapper: ShallowWrapper) {
  return wrapper
    .find(ResultItemGroup)
    .findWhere(n => n.key() === group.valueOf());
}

describe('ConfluenceSearchResults', () => {
  function render(partialProps: Partial<Props>) {
    const props = {
      query: '',
      isError: false,
      retrySearch: () => {},
      recentlyViewedPages: [],
      recentlyViewedSpaces: [],
      recentlyInteractedPeople: [],
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
      isLoading: false,
      ...partialProps,
    };

    return shallow(<div>{searchResults(props)}</div>);
  }

  it('should render recently viewed objects when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyViewedPages: [makeConfluenceObjectResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    expect(group.children()).toHaveLength(1);
  });

  it('should render recently viewed spaces when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyViewedSpaces: [makeConfluenceContainerResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Spaces, wrapper);

    expect(group.children()).toHaveLength(1);
  });

  it('should render objects when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      objectResults: [
        makeConfluenceObjectResult({
          name: 'name',
        }),
      ],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Objects, wrapper);

    expect(group.prop('title')).toEqual('Pages, blogs and attachments');
    expect(group.find(ObjectResultWithAnalytics).prop('name')).toEqual('name');
  });

  it('should render spaces when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      spaceResults: [
        makeConfluenceContainerResult({
          name: 'name',
        }),
      ],
    };

    const wrapper = render(props);
    const group = findGroup(Group.Spaces, wrapper);

    expect(group.prop('title')).toEqual('Spaces');
    expect(group.find(ContainerResultWithAnalytics).prop('name')).toEqual(
      'name',
    );
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
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
    };

    const wrapper = render(props);
    expect(wrapper.find(NoResults).exists()).toBe(true);
  });

  it('should render a link to confluence and people search when there are no results', () => {
    const props: Partial<Props> = {
      query: 'foo',
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
    };

    const wrapper = render(props);

    ['search_confluence', 'search_people'].forEach(resultId => {
      expect(
        wrapper
          .find(ResultBase)
          .findWhere(wrapper => wrapper.prop('resultId') === resultId)
          .exists(),
      ).toBe(true);
    });
  });
});
