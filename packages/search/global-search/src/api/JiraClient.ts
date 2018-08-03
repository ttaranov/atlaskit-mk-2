import {
  ContainerResult,
  ResultType,
  Result,
  AnalyticsType,
  ContentType,
} from '../model/Result';
import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import {
  makeJiraObjectResult,
  makeConfluenceContainerResult,
} from '../__tests__/unit/_test-util';

export interface JiraClient {
  getRecentObjects(searchSessionId: string): Promise<Result[]>;
  getRecentContainers(searchSessionId: string): Promise<Result[]>;
}

export default class JiraClientImpl implements JiraClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  private readonly RESULT_LIMIT = 10;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  // TODO replace mock data with an actual implementation s'il vous plait
  public async getRecentObjects(searchSessionId: string): Promise<Result[]> {
    return Promise.resolve([makeJiraObjectResult(), makeJiraObjectResult()]);
  }

  // TODO remove mock data (: D: D: D:
  public async getRecentContainers(searchSessionId: string): Promise<Result[]> {
    return Promise.resolve([makeConfluenceContainerResult()]);
  }
}
