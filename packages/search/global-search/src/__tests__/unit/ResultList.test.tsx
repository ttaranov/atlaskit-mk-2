import * as React from 'react';
import { shallow } from 'enzyme';
import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
} from '@atlaskit/quick-search';

import PageIcon from '@atlaskit/icon-object/glyph/page/24';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ResultList, { Props } from '../../components/ResultList';
import {
  Result,
  JiraResult,
  PersonResult,
  AnalyticsType,
  ConfluenceObjectResult,
  ContentType,
  ContainerResult,
} from '../../model/Result';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
  makeJiraObjectResult,
} from './_test-util';
import * as JiraAvatarUtil from '../../../src/util/jira-avatar-util';

const DUMMY_ANALYTICS_DATA = {
  resultCount: 123,
};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    results: [],
    sectionIndex: 0,
    ...partialProps,
  };

  return shallow(<ResultList {...props} />);
}

it('should pass the correct properties to ObjectResult for Jira results', () => {
  const jiraResults: JiraResult[] = [
    makeJiraObjectResult({
      resultId: 'resultId',
    }),
  ];

  const wrapper = render({
    results: jiraResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ObjectResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'jira-issue-resultId',
    type: 'result-jira',
    objectKey: 'objectKey',
    avatarUrl: 'avatarUrl',
    name: 'name',
    containerName: 'containerName',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should pass the correct properties to PersonResult for people results', () => {
  const peopleResults: PersonResult[] = [
    makePersonResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultPerson,
    }),
  ];

  const wrapper = render({
    results: peopleResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(PersonResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'person-resultId',
    type: 'result-person',
    avatarUrl: 'avatarUrl',
    name: 'name',
    mentionName: 'mentionName',
    presenceMessage: 'presenceMessage',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should pass the correct properties to ObjectResult for Confluence results', () => {
  const confluenceResults: ConfluenceObjectResult[] = [
    makeConfluenceObjectResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
  ];

  const wrapper = render({
    results: confluenceResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ObjectResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'confluence-page-resultId',
    type: 'result-confluence',
    name: 'name',
    containerName: 'containerName',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });

  const avatar = wrapper.find(ObjectResultComponent).prop('avatar');
  // @ts-ignore TS can't find type
  expect(avatar.type).toEqual(PageIcon);
});

it('should pass the correct properties to ContainerResult for Confluence spaces', () => {
  const confluenceSpaceResults: ContainerResult[] = [
    makeConfluenceContainerResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
  ];

  const wrapper = render({
    results: confluenceSpaceResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ContainerResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'confluence-space-resultId',
    type: 'result-confluence',
    avatarUrl: 'avatarUrl',
    name: 'name',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should avoid duplicate result keys', () => {
  const results: Result[] = [
    makeConfluenceContainerResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
    makeConfluenceObjectResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
    makePersonResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultPerson,
    }),
  ];

  const wrapper = render({
    results,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  const containerKey = wrapper.find(ContainerResultComponent).key();
  const objectKey = wrapper.find(ObjectResultComponent).key();
  const personKey = wrapper.find(PersonResultComponent).key();

  expect(containerKey).toBe('confluence-space-resultId');
  expect(objectKey).toBe('confluence-page-resultId');
  expect(personKey).toBe('person-resultId');
});

describe('Jira Avatar default Icons', () => {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(JiraAvatarUtil, 'getDefaultAvatar');
    spy.mockReturnValue(BoardIcon);
  });

  afterEach(() => {
    spy.mockRestore();
  });
  it('should support default icons for jira if avatar is missing', () => {
    let jiraItem = makeJiraObjectResult({
      resultId: 'resultId',
    });
    jiraItem.contentType = ContentType.JiraBoard;
    jiraItem.avatarUrl = undefined;
    const jiraResults: JiraResult[] = [jiraItem];
    const wrapper = render({
      results: jiraResults,
      analyticsData: DUMMY_ANALYTICS_DATA,
    });

    const avatar = wrapper.find(ObjectResultComponent).prop('avatar');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(avatar).toEqual(BoardIcon);
  });
});
