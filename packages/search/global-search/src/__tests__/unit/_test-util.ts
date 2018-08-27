import {
  AnalyticsType,
  ResultType,
  JiraObjectResult,
  ConfluenceObjectResult,
  ContentType,
  ContainerResult,
  PersonResult,
} from '../../model/Result';

function buildMockSearchResultProperties() {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    avatarUrl: 'avatarUrl',
    href: 'href',
  };
}

export function makeJiraObjectResult(
  partial?: Partial<JiraObjectResult>,
): JiraObjectResult {
  return {
    analyticsType: AnalyticsType.ResultJira,
    resultType: ResultType.JiraObjectResult,
    objectKey: 'objectKey',
    containerName: 'containerName',
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceObjectResult(
  partial?: Partial<ConfluenceObjectResult>,
): ConfluenceObjectResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    containerName: 'containerName',
    contentType: ContentType.ConfluencePage,
    containerId: 'containerId',
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceContainerResult(
  partial?: Partial<ContainerResult>,
): ContainerResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.GenericContainerResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makePersonResult(
  partial?: Partial<PersonResult>,
): PersonResult {
  return {
    mentionName: 'mentionName',
    presenceMessage: 'presenceMessage',
    analyticsType: AnalyticsType.ResultPerson,
    resultType: ResultType.PersonResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}
