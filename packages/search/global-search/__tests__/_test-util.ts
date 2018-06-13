import {
  GlobalSearchResult,
  AnalyticsType,
  GlobalSearchResultTypes,
  GlobalSearchJiraObjectResult,
  GlobalSearchConfluenceObjectResult,
  ContentType,
  GlobalSearchContainerResult,
  GlobalSearchPersonResult,
} from '../src/model/Result';

function buildMockSearchResultProperties() {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    avatarUrl: 'avatarUrl',
    href: 'href',
  };
}

export function makeJiraObjectResult(
  partial?: Partial<GlobalSearchJiraObjectResult>,
): GlobalSearchJiraObjectResult {
  return {
    analyticsType: AnalyticsType.ResultJira,
    globalSearchResultType: GlobalSearchResultTypes.JiraObjectResult,
    objectKey: 'HOT-123',
    containerName: 'PROJECT',
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceObjectResult(
  partial?: Partial<GlobalSearchConfluenceObjectResult>,
): GlobalSearchConfluenceObjectResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    globalSearchResultType: GlobalSearchResultTypes.ConfluenceObjectResult,
    containerName: 'SPACE',
    contentType: ContentType.ConfluencePage,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makeConfluenceContainerResult(
  partial?: Partial<GlobalSearchContainerResult>,
): GlobalSearchContainerResult {
  return {
    analyticsType: AnalyticsType.ResultConfluence,
    globalSearchResultType: GlobalSearchResultTypes.GenericContainerResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function makePersonResult(
  partial?: Partial<GlobalSearchPersonResult>,
): GlobalSearchPersonResult {
  return {
    mentionName: 'patato',
    presenceMessage: 'head of everything',
    analyticsType: AnalyticsType.ResultPerson,
    globalSearchResultType: GlobalSearchResultTypes.PersonResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}
