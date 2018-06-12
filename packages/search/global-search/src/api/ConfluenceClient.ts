import {
  GlobalSearchContainerResult,
  GlobalSearchResultTypes,
  GlobalSearchResult,
  AnalyticsType,
  GlobalSearchConfluenceObjectResult,
  ObjectType,
} from '../model/Result';
import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';

export interface ConfluenceClient {
  getRecentItems(): Promise<GlobalSearchResult[]>;
  getRecentSpaces(): Promise<GlobalSearchResult[]>;
}

export interface RecentPage {
  available: boolean;
  contentType: 'blogpost' | 'page';
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

  private readonly RESULT_LIMIT = 10;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(): Promise<GlobalSearchResult[]> {
    const recentPages = await this.createRecentRequestPromise<RecentPage>(
      RECENT_PAGES_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentPages.map(recentPage =>
      recentPageToResult(recentPage, baseUrl),
    );
  }

  public async getRecentSpaces(): Promise<GlobalSearchResult[]> {
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
        limit: this.RESULT_LIMIT,
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }
}

function recentPageToResult(
  recentPage: RecentPage,
  baseUrl: string,
): GlobalSearchResult {
  return {
    resultId: recentPage.id,
    name: recentPage.title,
    href: `${baseUrl}${recentPage.url}`,
    containerName: recentPage.space,
    analyticsType: AnalyticsType.RecentConfluence,
    globalSearchResultType: GlobalSearchResultTypes.ConfluenceObjectResult,
    objectType: `confluence-${recentPage.contentType}` as ObjectType,
  } as GlobalSearchConfluenceObjectResult;
}

function recentSpaceToResult(
  recentSpace: RecentSpace,
  baseUrl: string,
): GlobalSearchResult {
  return {
    resultId: recentSpace.id,
    name: recentSpace.name,
    href: `${baseUrl}/spaces/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
    analyticsType: AnalyticsType.RecentConfluence,
    globalSearchResultType: GlobalSearchResultTypes.GenericContainerResult,
    objectType: ObjectType.ConfluenceSpace,
  } as GlobalSearchContainerResult;
}
