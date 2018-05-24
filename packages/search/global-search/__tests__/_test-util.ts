import { Result, ResultType, AnalyticsType } from '../src/model/Result';

export function makeResult(partial?: Partial<Result>): Result {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    resultType: ResultType.Object,
    analyticsType: AnalyticsType.ResultJira,
    avatarUrl: 'avatarUrl',
    href: 'href',
    ...partial,
  };
}

export function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}
