import {
  Result,
  ResultType,
  AnalyticsType,
  ContainerResult,
  JiraObjectResult,
  ConfluenceObjectResult,
  ContentType,
} from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import * as URI from 'urijs';

export type ConfluenceItemContentType = 'page' | 'blogpost';
export type CrossProductSearchResults = {
  results: Map<Scope, Result[]>;
  experimentId?: string;
  abTest?: ABTest;
};

export enum Scope {
  ConfluencePageBlog = 'confluence.page,blogpost',
  ConfluencePageBlogAttachment = 'confluence.page,blogpost,attachment',
  ConfluenceSpace = 'confluence.space',
  JiraIssue = 'jira.issue',
}

export const EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE: CrossProductSearchResults = {
  experimentId: '',
  results: new Map(),
};

export interface CrossProductSearchResponse {
  scopes: ScopeResult[];
}

export interface JiraItem {
  key: string;
  fields: {
    summary: string;
    project: {
      name: string;
    };
    issuetype: {
      iconUrl: string;
    };
  };
}

export interface ConfluenceItem {
  title: string; // this is highlighted
  baseUrl: string;
  url: string;
  content?: {
    id: string;
    type: ConfluenceItemContentType;
  };
  container: {
    title: string; // this is unhighlighted
    displayUrl: string;
  };
  space?: {
    key: string; // currently used as instance-unique ID
    icon: {
      path: string;
    };
  };
  iconCssClass: string; // icon-file-* for attachments, otherwise not needed
}

export type SearchItem = ConfluenceItem | JiraItem;

export interface ABTest {
  abTestId: string;
  controlId: string;
  experimentId: string;
}

export interface ScopeResult {
  id: Scope;
  error?: string;
  results: SearchItem[];
  // @deprecated
  experimentId?: string;
  abTest?: ABTest;
}

export interface CrossProductSearchClient {
  search(
    query: string,
    searchSessionId: string,
    scopes: Scope[],
  ): Promise<CrossProductSearchResults>;
}

export default class CrossProductSearchClientImpl
  implements CrossProductSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  // result limit per scope
  private readonly RESULT_LIMIT = 10;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async search(
    query: string,
    searchSessionId: string,
    scopes: Scope[],
  ): Promise<CrossProductSearchResults> {
    const response = await this.makeRequest(query, scopes);

    return this.parseResponse(response, searchSessionId);
  }

  private async makeRequest(
    query: string,
    scopes: Scope[],
  ): Promise<CrossProductSearchResponse> {
    const body = {
      query: query,
      cloudId: this.cloudId,
      limit: this.RESULT_LIMIT,
      scopes: scopes,
    };

    const options: RequestServiceOptions = {
      path: 'quicksearch/v1',
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    };

    return utils.requestService<CrossProductSearchResponse>(
      this.serviceConfig,
      options,
    );
  }

  /**
   * Converts the raw xpsearch-aggregator response into a CrossProductSearchResults object containing
   * the results set and the experimentId that generated them.
   *
   * @param response
   * @param searchSessionId
   * @returns a CrossProductSearchResults object
   */
  private parseResponse(
    response: CrossProductSearchResponse,
    searchSessionId: string,
  ): CrossProductSearchResults {
    let experimentId;
    let abTest;
    const results: Map<Scope, Result[]> = response.scopes.reduce(
      (resultsMap, scopeResult) => {
        resultsMap.set(
          scopeResult.id,
          scopeResult.results.map(result =>
            mapItemToResult(
              scopeResult.id as Scope,
              result,
              searchSessionId,
              scopeResult.experimentId,
            ),
          ),
        );
        experimentId = scopeResult.experimentId;
        abTest = scopeResult.abTest;
        return resultsMap;
      },
      new Map(),
    );

    return { results, experimentId, abTest };
  }
}

export function removeHighlightTags(text: string): string {
  return text.replace(/@@@hl@@@|@@@endhl@@@/g, '');
}

function mapItemToResult(
  scope: Scope,
  item: SearchItem,
  searchSessionId: string,
  experimentId?: string,
): Result {
  switch (scope) {
    case Scope.ConfluencePageBlog:
    case Scope.ConfluencePageBlogAttachment: {
      return mapConfluenceItemToResultObject(
        item as ConfluenceItem,
        searchSessionId,
        experimentId,
      );
    }
    case Scope.ConfluenceSpace: {
      return mapConfluenceItemToResultSpace(
        item as ConfluenceItem,
        searchSessionId,
        experimentId,
      );
    }
    case Scope.JiraIssue: {
      return mapJiraItemToResult(item as JiraItem);
    }
    default: {
      // Make the TS compiler verify that all enums have been matched
      const _nonExhaustiveMatch: never = scope;
      throw new Error(`Non-exhaustive match for scope: ${_nonExhaustiveMatch}`);
    }
  }
}

function mapConfluenceItemToResultObject(
  item: ConfluenceItem,
  searchSessionId: string,
  experimentId?: string,
): ConfluenceObjectResult {
  const href = new URI(`${item.baseUrl}${item.url}`);
  href.addQuery('search_id', searchSessionId);

  return {
    resultId: item.content!.id, // content always available for pages/blogs/attachments
    name: removeHighlightTags(item.title),
    href: `${href.pathname()}?${href.query()}`,
    containerName: item.container.title,
    analyticsType: AnalyticsType.ResultConfluence,
    contentType: `confluence-${item.content!.type}` as ContentType,
    resultType: ResultType.ConfluenceObjectResult,
    containerId: 'UNAVAILABLE', // TODO
    iconClass: item.iconCssClass,
    experimentId: experimentId,
  };
}

function mapJiraItemToResult(item: JiraItem): JiraObjectResult {
  return {
    resultId: `search- + ${item.key}`,
    avatarUrl: item.fields.issuetype.iconUrl,
    name: item.fields.summary,
    href: `/browse/${item.key}`,
    containerName: item.fields.project.name,
    objectKey: item.key,
    analyticsType: AnalyticsType.ResultJira,
    resultType: ResultType.JiraObjectResult,
  };
}

function mapConfluenceItemToResultSpace(
  spaceItem: ConfluenceItem,
  searchSessionId: string,
  experimentId?: string,
): ContainerResult {
  // add searchSessionId
  const href = new URI(
    `${spaceItem.baseUrl || ''}${spaceItem.container.displayUrl}`,
  );
  href.addQuery('search_id', searchSessionId);

  return {
    resultId: `space-${spaceItem.space!.key}`, // space is always defined for space results
    avatarUrl: `${spaceItem.baseUrl}${spaceItem.space!.icon.path}`,
    name: spaceItem.container.title,
    href: `${href.pathname()}?${href.query()}`,
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.GenericContainerResult,
    experimentId: experimentId,
  };
}
