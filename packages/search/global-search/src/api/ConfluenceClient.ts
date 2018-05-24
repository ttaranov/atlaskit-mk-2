import {
  Result,
  ResultType,
  ResultContentType,
  AnalyticsType,
} from '../model/Result';
import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';

export interface ConfluenceClient {
  getRecentItems(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
}

export interface RecentPage {
  available: boolean;
  contentType: ResultContentType;
  id: string;
  lastSeen: number;
  space: string;
  spaceKey: string;
  title: string;
  type: string;
  url: string;
}

export interface RecentSpace {
  id: string;
  key: string;
  icon: string;
  name: string;
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(): Promise<Result[]> {
    const recentPages = await this.createRecentRequestPromise<RecentPage>(
      RECENT_PAGES_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentPages.map(recentPage =>
      recentPageToResult(recentPage, baseUrl),
    );
  }

  public async getRecentSpaces(): Promise<Result[]> {
    const recentSpaces = await this.createRecentRequestPromise<RecentSpace>(
      RECENT_SPACE_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentSpaces.map(recentSpace =>
      recentSpaceToResult(recentSpace, baseUrl),
    );
  }

  private createRecentRequestPromise<T>(path: string): Promise<Array<T>> {
    const options: RequestServiceOptions = {
      path: path,
      queryParams: {
        cloudId: this.cloudId,
        limit: 10,
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }
}

function recentPageToResult(recentPage: RecentPage, baseUrl: string): Result {
  return {
    resultId: recentPage.id,
    resultType: ResultType.Object,
    name: recentPage.title,
    href: `${baseUrl}${recentPage.url}`,
    containerName: recentPage.space,
    contentType: recentPage.contentType,
    analyticsType: AnalyticsType.RecentConfluence,
  };
}

function recentSpaceToResult(
  recentSpace: RecentSpace,
  baseUrl: string,
): Result {
  return {
    resultId: recentSpace.id,
    resultType: ResultType.Container,
    name: recentSpace.name,
    href: `${baseUrl}/spaces/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
    analyticsType: AnalyticsType.RecentConfluence,
  };
}
