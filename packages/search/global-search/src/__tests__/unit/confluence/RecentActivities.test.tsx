import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import RecentActivities, {
  Props,
} from '../../../components/confluence/RecentActivities';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from '../_test-util';
import { mountWithIntl } from '../helpers/_intl-enzyme-test-helper';
import { Props as ResultGroupProps } from '../../../components/ResultGroup';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    searchSessionId: '0',
    ...partialProps,
  };

  return shallow(<RecentActivities {...props} />);
}

function renderMount(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    searchSessionId: '0',
    ...partialProps,
  };

  return mountWithIntl(<RecentActivities {...props} />);
}

function findGroup(
  wrapper: ShallowWrapper,
  key: string,
): ShallowWrapper<ResultGroupProps> {
  return wrapper.findWhere(n => n.key() === key);
}

it('should render objects', () => {
  const wrapper = render({
    recentlyViewedPages: [makeConfluenceObjectResult()],
  });

  expect(findGroup(wrapper, 'objects').prop('results')).toHaveLength(1);
});

it('should render spaces', () => {
  const wrapper = render({
    recentlyViewedSpaces: [makeConfluenceContainerResult()],
  });

  expect(findGroup(wrapper, 'spaces').prop('results')).toHaveLength(1);
});

it('should render people', () => {
  const wrapper = render({
    recentlyInteractedPeople: [makePersonResult()],
  });

  expect(findGroup(wrapper, 'people').prop('results')).toHaveLength(1);
});

it('should pass in the correct resultCount into the analytics data', () => {
  const wrapper = render({
    recentlyViewedPages: [
      makeConfluenceObjectResult(),
      makeConfluenceObjectResult(),
    ],
    recentlyViewedSpaces: [makeConfluenceContainerResult()],
    recentlyInteractedPeople: [makePersonResult()],
  });

  expect(findGroup(wrapper, 'objects').prop('analyticsData')).toEqual({
    resultCount: 4,
  });
  expect(findGroup(wrapper, 'spaces').prop('analyticsData')).toEqual({
    resultCount: 4,
  });
  expect(findGroup(wrapper, 'people').prop('analyticsData')).toEqual({
    resultCount: 4,
  });
});

it('should fire pre query screen event', () => {
  const preQueryScreenCounter = {
    name: 'preQueryScreenCounter',
    increment: jest.fn(),
    getCount: jest.fn(() => 101),
  };

  renderMount({
    recentlyViewedPages: [makeConfluenceObjectResult()],
    screenCounter: preQueryScreenCounter,
  });

  expect(preQueryScreenCounter.increment.mock.calls.length).toBe(1);
  expect(preQueryScreenCounter.getCount.mock.calls.length).toBe(1);
});

describe('sectionIndex', () => {
  it('should increment properly', () => {
    const wrapper = render({
      recentlyViewedPages: [makeConfluenceObjectResult()],
      recentlyViewedSpaces: [makeConfluenceContainerResult()],
      recentlyInteractedPeople: [makePersonResult()],
    });

    expect(findGroup(wrapper, 'objects').prop('sectionIndex')).toBe(0);
    expect(findGroup(wrapper, 'spaces').prop('sectionIndex')).toBe(1);
    expect(findGroup(wrapper, 'people').prop('sectionIndex')).toBe(2);
  });

  it('should increment properly when groups are empty', () => {
    const wrapper = render({
      recentlyViewedPages: [],
      recentlyViewedSpaces: [],
      recentlyInteractedPeople: [makePersonResult()],
    });

    expect(findGroup(wrapper, 'people').prop('sectionIndex')).toBe(0);
  });
});
