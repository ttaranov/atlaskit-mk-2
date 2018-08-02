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
import * as URI from 'urijs';
import * as unescapeHtml from 'unescape';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';

export interface JiraClient {
  getRecentItems(searchSessionId: string): Promise<Result[]>;
}

export default class JiraClientImpl implements JiraClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  private readonly RESULT_LIMIT = 10;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(searchSessionId: string): Promise<Result[]> {
    return Promise.resolve([]);
  }
}
