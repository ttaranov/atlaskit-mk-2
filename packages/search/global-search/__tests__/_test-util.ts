import {
  GlobalSearchResult,
  AnalyticsType,
  ObjectType,
  GlobalSearchResultTypes,
} from '../src/model/Result';

export function makeResult(
  partial?: Partial<GlobalSearchResult>,
): GlobalSearchResult {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    analyticsType: AnalyticsType.ResultJira,
    avatarUrl: 'avatarUrl',
    href: 'href',
    globalSearchResultType: GlobalSearchResultTypes.JiraObjectResult,
    objectType: ObjectType.JiraIssue,
    ...partial,
  };
}

export function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}
