import * as React from 'react';
import { shallow } from 'enzyme';
import ResultGroupsComponent, {
  Props,
  ResultGroupType,
} from '../../../components/common/ResultGroupsComponent';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from '../_test-util';
import { mountWithIntl } from '../helpers/_intl-enzyme-test-helper';
import ResultGroup from '../../../components/ResultGroup';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    resultsGroups: [],
    type: ResultGroupType.PreQuery,
    renderAdvancedSearch: () => <a>link</a>,
    searchSessionId: '0',
    ...partialProps,
  };

  return shallow(<ResultGroupsComponent {...props} />);
}

function renderMount(partialProps: Partial<Props>) {
  const props: Props = {
    resultsGroups: [],
    type: ResultGroupType.PreQuery,
    renderAdvancedSearch: () => <a key="advanced-link">link</a>,
    searchSessionId: '0',
    ...partialProps,
  };

  return mountWithIntl(<ResultGroupsComponent {...props} />);
}

it('should render passed objects', () => {
  const resultsGroups = [
    {
      items: [makeConfluenceObjectResult(), makeConfluenceObjectResult()],
      key: 'recentlyViewedPages',
      titleI18nId: 'recentlyViewedPages.key',
    },
    {
      items: [makeConfluenceContainerResult()],
      key: 'recentlyViewedSpaces',
      titleI18nId: 'recentlyViewedSpaces.key',
    },
    {
      items: [makePersonResult(), makePersonResult(), makePersonResult()],
      key: 'recentlyInteractedPeople',
      titleI18nId: 'recentlyInteractedPeople.key',
    },
  ];

  const wrapper = render({
    resultsGroups,
  });

  const groups = wrapper.find(ResultGroup);
  expect(groups.length).toBe(3);
  groups.forEach((group, index) => {
    expect(group.props()).toMatchObject({
      analyticsData: { resultCount: 6 },
      sectionIndex: index,
      results: resultsGroups[index].items,
    });
    expect(group.key()).toBe(`${resultsGroups[index].key}-${index}`);
  });
});

it('should filter out empty groups', () => {
  const resultsGroups = [
    {
      items: [makeConfluenceObjectResult(), makeConfluenceObjectResult()],
      key: 'recentlyViewedPages',
      titleI18nId: 'recentlyViewedPages.key',
    },
    {
      items: [],
      key: 'empty',
      titleI18nId: 'empty',
    },
    {
      items: [],
      key: 'empty2',
      titleI18nId: 'empty2',
    },
    {
      items: [makePersonResult(), makePersonResult(), makePersonResult()],
      key: 'recentlyInteractedPeople',
      titleI18nId: 'recentlyInteractedPeople.key',
    },
  ];

  const wrapper = render({
    resultsGroups,
  });

  const groups = wrapper.find(ResultGroup);
  expect(groups.length).toBe(2);
  groups
    .map(group => ({
      key: group.key(),
      sectionIndex: group.props().sectionIndex,
    }))
    .forEach(({ key, sectionIndex }, index) => {
      expect(key).toBe(`${resultsGroups[index * 3].key}-${sectionIndex}`);
      expect(sectionIndex).toBe(index);
    });
});

it('should fire pre query screen event', () => {
  const preQueryScreenCounter = {
    name: 'preQueryScreenCounter',
    increment: jest.fn(),
    getCount: jest.fn(() => 101),
  };

  renderMount({
    resultsGroups: [
      {
        items: [makeConfluenceContainerResult()],
        key: 'recentlyViewedSpaces',
        titleI18nId: 'recentlyViewedSpaces.key',
      },
    ],
    screenCounter: preQueryScreenCounter,
    type: ResultGroupType.PreQuery,
  });

  expect(preQueryScreenCounter.increment.mock.calls.length).toBe(1);
  expect(preQueryScreenCounter.getCount.mock.calls.length).toBe(1);
});
