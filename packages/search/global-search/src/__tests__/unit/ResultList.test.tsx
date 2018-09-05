import * as React from 'react';
import { shallow, mount } from 'enzyme';
import {
  ObjectResult as ObjectResultComponent,
  ContainerResult as ContainerResultComponent,
  PersonResult as PersonResultComponent,
} from '@atlaskit/quick-search';
import Objects24Object24PageIcon from '@atlaskit/icon/glyph/objects/24/object-24-page';
import ResultList, { Props } from '../../components/ResultList';
import {
  JiraObjectResult,
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
  const jiraResults: JiraObjectResult[] = [
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
    resultId: 'resultId',
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

  const peopleResult = wrapper.find('[resultId="resultId"]');
  expect(peopleResult.length).toBe(1);
  expect(peopleResult.key()).toBe('resultId');
  expect(peopleResult.props()).toMatchObject({
    href: 'href',
    resultId: 'resultId',
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
    resultId: 'resultId',
    type: 'result-confluence',
    name: 'name',
    containerName: 'containerName',
    contentType: ContentType.ConfluencePage,
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });

  const avatar: { type: string } = wrapper
    .find(ObjectResultComponent)
    .prop('avatar');
  expect(avatar.type).toEqual(Objects24Object24PageIcon);
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
    resultId: 'resultId',
    type: 'result-confluence',
    avatarUrl: 'avatarUrl',
    name: 'name',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

describe('Open person result in new tab', () => {
  const mountElemnt = (partialProps: Partial<Props>) => {
    const props: Props = {
      results: [],
      sectionIndex: 0,
      ...partialProps,
    };

    return mount(<ResultList {...props} />);
  };
  let windowOpenSpy;
  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open');
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should open people result in new tab', () => {
    const windowOpenSpy = jest.spyOn(window, 'open');
    const peopleResults: PersonResult[] = [
      makePersonResult({
        resultId: 'person-resultId',
        analyticsType: AnalyticsType.ResultPerson,
        href: 'http://www.example.com/',
      }),
    ];

    const wrapper = mountElemnt({
      results: peopleResults,
      analyticsData: DUMMY_ANALYTICS_DATA,
    });

    const peopleResultComponent = wrapper.find(PersonResultComponent);
    peopleResultComponent.simulate('click');

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    expect(windowOpenSpy).toBeCalledWith('http://www.example.com/', '_blank');
  });
});
