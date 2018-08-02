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

  // TODO
  public async getRecentObjects(searchSessionId: string): Promise<Result[]> {
    return Promise.resolve([]);
  }

  // TODO
  public async getRecentContainers(searchSessionId: string): Promise<Result[]> {
    return Promise.resolve([]);
  }
}
