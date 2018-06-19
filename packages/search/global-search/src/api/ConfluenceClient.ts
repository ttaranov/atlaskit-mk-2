import {
  ContainerResult,
  ResultType,
  Result,
  AnalyticsType,
  ConfluenceObjectResult,
  ContentType,
} from '../model/Result';
import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import * as URI from 'urijs';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';
const QUICK_NAV_PATH: string = 'rest/quicknav/1/search';

export interface ConfluenceClient {
  getRecentItems(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
  searchQuickNav(query: string, searchSessionId: string): Promise<Result[]>;
}

export type ConfluenceContentType = 'blogpost' | 'page';

export interface RecentPage {
  available: boolean;
  contentType: ConfluenceContentType;
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

export interface QuickNavResponse {
  contentNameMatches: QuickNavResult[][];
}

export interface QuickNavResult {
  className: string;
  href: string;
  name: string;
  id?: string; // null for spaces
  space?: string; // null for spaces
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  private readonly RESULT_LIMIT = 10;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async searchQuickNav(
    query: string,
    searchSessionId: string,
  ): Promise<Result[]> {
    const quickNavResponse = await this.createQuickNavRequestPromise(query);
    const baseUrl = this.serviceConfig.url;

    return quickNavResultsToResults(
      quickNavResponse.contentNameMatches,
      baseUrl,
      searchSessionId,
    );
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

  private createQuickNavRequestPromise(
    query: string,
  ): Promise<QuickNavResponse> {
    const options: RequestServiceOptions = {
      path: QUICK_NAV_PATH,
      queryParams: {
        query: query,
      },
    };

    return utils.requestService(this.serviceConfig, options);
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

function recentPageToResult(recentPage: RecentPage, baseUrl: string): Result {
  return {
    resultId: recentPage.id,
    name: recentPage.title,
    href: `${baseUrl}${recentPage.url}`,
    containerName: recentPage.space,
    analyticsType: AnalyticsType.RecentConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    contentType: `confluence-${recentPage.contentType}` as ContentType,
  } as ConfluenceObjectResult;
}

function recentSpaceToResult(
  recentSpace: RecentSpace,
  baseUrl: string,
): Result {
  return {
    resultId: recentSpace.id,
    name: recentSpace.name,
    href: `${baseUrl}/spaces/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
    analyticsType: AnalyticsType.RecentConfluence,
    resultType: ResultType.GenericContainerResult,
  } as ContainerResult;
}

function quickNavResultToObjectResult(
  quickNavResult: QuickNavResult,
  contentType: ContentType,
  searchSessionId: string,
): ConfluenceObjectResult {
  // add searchSessionId
  const href = new URI(quickNavResult.href);
  href.addQuery('searchSessionId', searchSessionId);

  return {
    name: quickNavResult.name,
    href: href.toString(),
    resultId: quickNavResult.id!, // never null for pages, blogs & attachments
    contentType: contentType,
    containerName: quickNavResult.space!, // never null for pages, blogs & attachments
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.ConfluenceObjectResult,
  };
}

function quickNavResultsToResults(
  quickNavResultGroups: QuickNavResult[][],
  baseUrl: string,
  searchSessionId: string,
): Result[] {
  // quick nav responds with more than just attachments, pages and blogs, but that's all
  // but they're ordered, so let's preserve that.
  const results: ConfluenceObjectResult[] = [];

  // loop over each group, and each element inside the group and
  // map it to the correct object.
  quickNavResultGroups.forEach((quickNavResults: QuickNavResult[]) => {
    quickNavResults.forEach((result: QuickNavResult) => {
      if (result.className.startsWith('content-type-attachment')) {
        results.push(
          quickNavResultToObjectResult(
            result,
            ContentType.ConfluenceAttachment,
            searchSessionId,
          ),
        );
      } else if (result.className === 'content-type-blogpost') {
        results.push(
          quickNavResultToObjectResult(
            result,
            ContentType.ConfluenceBlogpost,
            searchSessionId,
          ),
        );
      } else if (result.className === 'content-type-page') {
        results.push(
          quickNavResultToObjectResult(
            result,
            ContentType.ConfluencePage,
            searchSessionId,
          ),
        );
      }
    });
  });

  // NB: it appears that the QuickNav endpoint only returns 6 blogs/pages and 2 attachments
  // which is convenient.
  return results;
}
