import {
  AnalyticsType,
  ResultType,
  JiraResult,
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
  partial?: Partial<JiraResult>,
): JiraResult {
  return {
    analyticsType: AnalyticsType.ResultJira,
    resultType: ResultType.JiraObjectResult,
    objectKey: 'objectKey',
    containerName: 'containerName',
    contentType: ContentType.JiraIssue,
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
    contentType: ContentType.ConfluenceSpace,
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
    contentType: ContentType.Person,
    analyticsType: AnalyticsType.ResultPerson,
    resultType: ResultType.PersonResult,
    ...buildMockSearchResultProperties(),
    ...partial,
  };
}

export function delay<T>(millis: number = 1, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis));
}

export function waitUntil(
  condition: () => boolean,
  totalTime: number,
  timeBetweenRetries?: number,
): Promise<void> {
  let waitingTime = 0;
  const timeToWait = timeBetweenRetries || 100;
  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      if (condition()) {
        clearInterval(id);
        resolve();
      }
      waitingTime += timeToWait;
      if (waitingTime > totalTime) {
        reject();
      }
    }, timeToWait);
  });
}
