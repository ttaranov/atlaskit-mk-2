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
import * as unescapeHtml from 'unescape';

const RECENT_PAGES_PATH: string = 'rest/recentlyviewed/1.0/recent';
const RECENT_SPACE_PATH: string = 'rest/recentlyviewed/1.0/recent/spaces';
const QUICK_NAV_PATH: string = 'rest/quicknav/1/search';

const QUICKNAV_CLASSNAME_ATTACHMENT_PREFIX = 'content-type-attachment';
const QUICKNAV_CLASSNAME_PAGE = 'content-type-page';
const QUICKNAV_CLASSNAME_BLOGPOST = 'content-type-blogpost';

type ValidQuickNavResultClassName =
  | 'content-type-attachment'
  | 'content-type-page'
  | 'content-type-blogpost';

export interface ConfluenceClient {
  getRecentItems(searchSessionId: string): Promise<Result[]>;
  getRecentSpaces(searchSessionId: string): Promise<Result[]>;
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
  iconClass: string;
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
  spaceName?: string; // null for spaces,
  spaceKey?: string; // null for spaces
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

    return quickNavResultsToResults(
      quickNavResponse.contentNameMatches,
      searchSessionId,
    );
  }

  public async getRecentItems(searchSessionId: string): Promise<Result[]> {
    const recentPages = await this.createRecentRequestPromise<RecentPage>(
      RECENT_PAGES_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentPages.map(recentPage =>
      recentPageToResult(recentPage, baseUrl, searchSessionId),
    );
  }

  public async getRecentSpaces(searchSessionId: string): Promise<Result[]> {
    const recentSpaces = await this.createRecentRequestPromise<RecentSpace>(
      RECENT_SPACE_PATH,
    );
    const baseUrl = this.serviceConfig.url;

    return recentSpaces.map(recentSpace =>
      recentSpaceToResult(recentSpace, baseUrl, searchSessionId),
    );
  }

  private createQuickNavRequestPromise(
    query: string,
  ): Promise<QuickNavResponse> {
    const options: RequestServiceOptions = {
      path: QUICK_NAV_PATH,
      queryParams: {
        query: query.trim(),
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

function recentPageToResult(
  recentPage: RecentPage,
  baseUrl: string,
  searchSessionId: string,
): Result {
  // add searchSessionId safely
  const href = new URI(`${baseUrl}${recentPage.url}`);
  href.addQuery('search_id', searchSessionId);

  return {
    resultId: recentPage.id,
    name: recentPage.title,
    href: href.toString(),
    containerName: recentPage.space,
    analyticsType: AnalyticsType.RecentConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    contentType: `confluence-${recentPage.contentType}` as ContentType,
    iconClass: recentPage.iconClass,
    containerId: recentPage.spaceKey,
  } as ConfluenceObjectResult;
}

function recentSpaceToResult(
  recentSpace: RecentSpace,
  baseUrl: string,
  searchSessionId: string,
): Result {
  return {
    resultId: recentSpace.id,
    name: recentSpace.name,
    href: `${baseUrl}/spaces/${
      recentSpace.key
    }/overview?search_id=${searchSessionId}`,
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
  href.addQuery('search_id', searchSessionId);

  return {
    name: unescapeHtml(quickNavResult.name),
    href: href.toString(),
    resultId: quickNavResult.id!, // never null for pages, blogs & attachments
    contentType: contentType,
    containerName: unescapeHtml(quickNavResult.spaceName!), // never null for pages, blogs & attachments
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.ConfluenceObjectResult,
    containerId: quickNavResult.spaceKey!,
    iconClass: quickNavResult.className,
  };
}

function isQuickNavResultContent(result: QuickNavResult): boolean {
  return (
    result.className.startsWith(QUICKNAV_CLASSNAME_ATTACHMENT_PREFIX) ||
    result.className === QUICKNAV_CLASSNAME_BLOGPOST ||
    result.className === QUICKNAV_CLASSNAME_PAGE
  );
}

function getContentType(className: ValidQuickNavResultClassName): ContentType {
  if (className.startsWith(QUICKNAV_CLASSNAME_ATTACHMENT_PREFIX)) {
    return ContentType.ConfluenceAttachment;
  } else if (className === QUICKNAV_CLASSNAME_BLOGPOST) {
    return ContentType.ConfluenceBlogpost;
  } else {
    return ContentType.ConfluencePage;
  }
}

function quickNavResultsToResults(
  quickNavResultGroups: QuickNavResult[][],
  searchSessionId: string,
): Result[] {
  // flatten the array as the response comes back as 2d array, then
  const flattenedResults: QuickNavResult[] = ([] as QuickNavResult[]).concat(
    ...quickNavResultGroups,
  );

  // filter out anything that's not a page, blog or attachment
  const filteredResults = flattenedResults.filter(isQuickNavResultContent);

  // map the results to our representation of a result
  const results: ConfluenceObjectResult[] = filteredResults.map(result =>
    quickNavResultToObjectResult(
      result,
      getContentType(result.className as ValidQuickNavResultClassName),
      searchSessionId,
    ),
  );

  // NB: it appears that the QuickNav endpoint only returns 6 blogs/pages and 2 attachments
  // which is convenient.
  return results;
}
