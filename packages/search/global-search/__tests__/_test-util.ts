import { Result, ResultType } from '../src/model/Result';

export function makeResult(partial?: Partial<Result>): Result {
  return {
    resultId: '' + Math.random(),
    name: 'name',
    type: ResultType.Object,
    avatarUrl: 'avatarUrl',
    href: 'href',
    ...partial,
  };
}
