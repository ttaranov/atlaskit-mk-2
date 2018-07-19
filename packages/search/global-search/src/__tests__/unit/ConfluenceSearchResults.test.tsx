import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import renderSearchResults, {
  Props,
  ScreenCounter,
} from '../../components/confluence/ConfluenceSearchResults';

import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
} from '@atlaskit/quick-search';

import AnalyticsEventFiredOnMount from '../../components/analytics/AnalyticsEventFiredOnMount';
import SearchError from '../../components/SearchError';
import NoResults from '../../components/NoResults';
import AdvancedSearchResult from '../../components/AdvancedSearchResult';
import NoRecentActivity from '../../components/NoRecentActivity';
import {
  makeConfluenceContainerResult,
  makeConfluenceObjectResult,
  makePersonResult,
} from './_test-util';
import { FormattedMessage } from 'react-intl';

enum Group {
  Objects = 'objects',
  Spaces = 'spaces',
  People = 'people',
  PeopleSearch = 'people-search',
  AdvancedSearch = 'advanced-search',
}

function findGroup(group: Group, wrapper: ShallowWrapper) {
  return wrapper.findWhere(n => n.key() === group.valueOf());
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
      searchSessionId: 'abc',
      ...partialProps,
    };
    // @ts-ignore
    return shallow(<div>{renderSearchResults(props)}</div>);
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

  it('should render recently interacted people results when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyInteractedPeople: [makePersonResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.prop('title')).toEqual(
      <FormattedMessage id="global-search.people.recent-people-heading" />,
    );
    expect(group.find(PersonResultComponent).prop('name')).toEqual('name');
  });

  describe('empty state', () => {
    it('should render empty state when no recent activities', () => {
      const props: Partial<Props> = {
        recentlyInteractedPeople: [],
        recentlyViewedPages: [],
        recentlyViewedSpaces: [],
      };

      const wrapper = render(props);
      const emptyState = wrapper.find(NoRecentActivity);
      expect(emptyState.length).toBe(1);
    });

    [
      {
        recentlyInteractedPeople: [makePersonResult()],
        recentlyViewedPages: [],
        recentlyViewedSpaces: [],
      },
      {
        recentlyInteractedPeople: [],
        recentlyViewedPages: [makeConfluenceObjectResult()],
        recentlyViewedSpaces: [],
      },
      {
        recentlyInteractedPeople: [],
        recentlyViewedPages: [],
        recentlyViewedSpaces: [makeConfluenceContainerResult()],
      },
    ].forEach(properties => {
      it('should not render empty state if any recent activity is not empty', () => {
        const wrapper = render(properties);
        const emptyState = wrapper.find(NoRecentActivity);
        expect(emptyState.length).toBe(0);
      });
    });
  });

  it('should render links to people and advanced search when no query is entered', () => {
    const props: Partial<Props> = {
      query: '',
      recentlyInteractedPeople: [makePersonResult()],
    };

    const wrapper = render(props);
    let group = findGroup(Group.AdvancedSearch, wrapper);
    expect(group.childAt(0).prop('resultId')).toEqual('search_confluence');
    expect(group.childAt(0).prop('text')).toEqual(
      <FormattedMessage id="global-search.confluence.advanced-search" />,
    );

    group = findGroup(Group.PeopleSearch, wrapper);
    expect(group.childAt(0).prop('resultId')).toEqual('search_people');
    expect(group.childAt(0).prop('text')).toEqual(
      <FormattedMessage id="global-search.people.advanced-search" />,
    );
  });

  it('should render links to people and advanced search when a query is entered and there are results', () => {
    const props: Partial<Props> = {
      query: 'foo bar',
      objectResults: [makeConfluenceObjectResult({ name: 'name' })],
    };

    const wrapper = render(props);
    let group = findGroup(Group.AdvancedSearch, wrapper);
    expect(group.childAt(0).prop('resultId')).toEqual('search_confluence');
    expect(group.childAt(0).prop('text')).toEqual(
      <FormattedMessage
        id="global-search.confluence.advanced-search-for"
        values={{ query: 'foo bar' }}
      />,
    );

    group = findGroup(Group.PeopleSearch, wrapper);
    expect(group.childAt(0).prop('resultId')).toEqual('search_people');
  });

  describe('Screen analytics', () => {
    let screenCounters;

    beforeEach(() => {
      screenCounters = {
        preQueryScreenCounter: {
          name: 'preQueryScreenCounter',
          increment: jest.fn(),
          getCount: jest.fn(() => 101),
        } as ScreenCounter,
        postQueryScreenCounter: {
          name: 'postQueryScreenCounter',
          increment: jest.fn(),
          getCount: jest.fn(() => 1),
        } as ScreenCounter,
      };
    });

    afterEach(() => {
      screenCounters = null;
    });

    const assertAnalyticsComponent = wrapper => {
      const analyticsComponent = wrapper.find(AnalyticsEventFiredOnMount);
      expect(analyticsComponent).toHaveLength(1);
      const { onEventFired, payloadProvider } = analyticsComponent.props();
      onEventFired();
      payloadProvider();
    };

    const assertCounters = ({ preQueryCalled, postQueryCalled }) => {
      const preQueryCallCount = preQueryCalled ? 1 : 0;
      const postQueryCallCount = postQueryCalled ? 1 : 0;
      expect(
        screenCounters.preQueryScreenCounter.increment.mock.calls.length,
      ).toBe(preQueryCallCount);
      expect(
        screenCounters.preQueryScreenCounter.getCount.mock.calls.length,
      ).toBe(preQueryCallCount);
      expect(
        screenCounters.postQueryScreenCounter.increment.mock.calls.length,
      ).toBe(postQueryCallCount);
      expect(
        screenCounters.postQueryScreenCounter.getCount.mock.calls.length,
      ).toBe(postQueryCallCount);
    };

    it('should render the post query screen analytics event when there are results', () => {
      const props: Partial<Props> = {
        query: 'foo bar',
        objectResults: [makeConfluenceObjectResult({ name: 'name' })],
        screenCounters,
      };

      const wrapper = render(props);
      assertAnalyticsComponent(wrapper);

      assertCounters({ preQueryCalled: false, postQueryCalled: true });
    });

    it('should render the pre query screen analytics event when there are results', () => {
      const props: Partial<Props> = {
        query: '',
        recentlyViewedPages: [makeConfluenceObjectResult({ name: 'name' })],
        screenCounters,
      };

      const wrapper = render(props);
      assertAnalyticsComponent(wrapper);

      assertCounters({ preQueryCalled: true, postQueryCalled: false });
    });
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

    expect(group.prop('title')).toEqual(
      <FormattedMessage id="global-search.confluence.confluence-objects-heading" />,
    );
    expect(group.find(ObjectResultComponent).prop('name')).toEqual('name');
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

    expect(group.prop('title')).toEqual(
      <FormattedMessage id="global-search.confluence.spaces-heading" />,
    );
    expect(group.find(ContainerResultComponent).prop('name')).toEqual('name');
  });

  it('should render people results when there are results', () => {
    const props: Partial<Props> = {
      query: 'na',
      peopleResults: [makePersonResult()],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.prop('title')).toEqual(
      <FormattedMessage id="global-search.people.people-heading" />,
    );
    expect(group.find(PersonResultComponent).prop('name')).toEqual('name');
  });

  it('should not render people results when there are no results in the group', () => {
    const props: Partial<Props> = {
      query: 'na',
      objectResults: [makeConfluenceObjectResult()],
      peopleResults: [],
    };

    const wrapper = render(props);
    const group = findGroup(Group.People, wrapper);

    expect(group.exists()).toEqual(false);
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
          .find(AdvancedSearchResult)
          .findWhere(wrapper => wrapper.prop('resultId') === resultId)
          .exists(),
      ).toBe(true);
    });
  });

  it('should render nothing on initial load', () => {
    const props: Partial<Props> = {
      query: '',
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
      isLoading: true,
    };

    const wrapper = render(props);
    expect(wrapper.children().length).toBe(0);
  });

  it('should render previous search result while loading', () => {
    const props: Partial<Props> = {
      query: 'abc',
      objectResults: [makeConfluenceObjectResult({ name: 'name' })],
      spaceResults: [],
      peopleResults: [],
      isLoading: true,
      keepRecentActivityResults: false,
      recentlyInteractedPeople: [makePersonResult()],
    };

    const wrapper = render(props);
    const objectGroup = findGroup(Group.Objects, wrapper);
    expect(objectGroup.children()).toHaveLength(1);

    const peopleGroup = findGroup(Group.People, wrapper);
    expect(peopleGroup.children()).toHaveLength(0);
  });

  it('should render recent activity while loading first search', () => {
    const props: Partial<Props> = {
      query: 'abc',
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
      isLoading: true,
      keepRecentActivityResults: true,
      recentlyInteractedPeople: [makePersonResult()],
    };

    const wrapper = render(props);
    const objectGroup = findGroup(Group.Objects, wrapper);
    expect(objectGroup.children()).toHaveLength(0);

    const peopleGroup = findGroup(Group.People, wrapper);
    expect(peopleGroup.children()).toHaveLength(1);
  });

  it('should render previous no search result while loading new search', () => {
    const props: Partial<Props> = {
      query: 'abc',
      objectResults: [],
      spaceResults: [],
      peopleResults: [],
      isLoading: true,
      keepRecentActivityResults: false,
      recentlyInteractedPeople: [makePersonResult()],
    };

    const wrapper = render(props);
    const objectGroup = findGroup(Group.Objects, wrapper);
    expect(objectGroup.children()).toHaveLength(0);

    const peopleGroup = findGroup(Group.People, wrapper);
    expect(peopleGroup.children()).toHaveLength(0);

    expect(wrapper.find(NoResults).exists()).toBe(true);
  });
});
