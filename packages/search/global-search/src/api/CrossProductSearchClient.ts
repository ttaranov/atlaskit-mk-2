import { Result, ResultType } from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export enum Scope {
  ConfluencePageBlog = 'confluence.page,blogpost',
  ConfluenceSpace = 'confluence.space',
  JiraIssue = 'jira.issue',
}

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
  lastModified: string;
  baseUrl: string;
  url: string;
  content: object;
  iconCssClass: string;
  container: {
    title: string; // this is unhighlighted
    displayUrl: string;
  };
}

export type SearchItem = ConfluenceItem | JiraItem;

export interface ScopeResult {
  id: Scope;
  error?: string;
  results: SearchItem[];
}

export interface CrossProductSearchClient {
  search(
    query: string,
    searchSessionId: string,
    scopes?: Scope[],
  ): Promise<Map<Scope, Result[]>>;
}

export default class CrossProductSearchClientImpl
  implements CrossProductSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async search(
    query: string,
    searchSessionId: string,
    scopes: Scope[],
  ): Promise<Map<Scope, Result[]>> {
    const response = await this.makeRequest(query, scopes);

    return this.parseResponse(response, searchSessionId, scopes);
  }

  private async makeRequest(
    query: string,
    scopes: Scope[],
  ): Promise<CrossProductSearchResponse> {
    const body = {
      query: query,
      cloudId: this.cloudId,
      limit: 5,
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

  private parseResponse(
    response: CrossProductSearchResponse,
    searchSessionId: string,
    scopes: Scope[],
  ): Map<Scope, Result[]> {
    const results: Map<Scope, Result[]> = response.scopes.reduce(
      (resultsMap, scopeResult) => {
        resultsMap.set(
          scopeResult.id,
          scopeResult.results.map(result =>
            mapItemToResult(scopeResult.id as Scope, result, searchSessionId),
          ),
        );

        return resultsMap;
      },
      new Map(),
    );

    return results;
  }
}

// TODO need real icons
export function getConfluenceAvatarUrl(iconCssClass: string): string {
  if (iconCssClass.indexOf('blogpost') > -1) {
    return 'https://home.useast.atlassian.io/confluence-blogpost-icon.svg';
  } else {
    return 'https://home.useast.atlassian.io/confluence-page-icon.svg';
  }
}

export function removeHighlightTags(text: string): string {
  return text.replace(/@@@hl@@@|@@@endhl@@@/g, '');
}

function mapItemToResult(
  scope: Scope,
  item: SearchItem,
  searchSessionId: string,
): Result {
  switch (scope) {
    case Scope.ConfluencePageBlog: {
      return mapConfluenceItemToResultObject(
        item as ConfluenceItem,
        searchSessionId,
      );
    }
    case Scope.ConfluenceSpace: {
      return mapConfluenceItemToResultSpace(item as ConfluenceItem);
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
): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + item.url,
    avatarUrl: getConfluenceAvatarUrl(item.iconCssClass),
    name: removeHighlightTags(item.title),
    href: `${item.baseUrl}${item.url}?search_id=${searchSessionId}`,
    containerName: item.container.title,
  };
}

function mapJiraItemToResult(item: JiraItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + item.key,
    avatarUrl: item.fields.issuetype.iconUrl,
    name: item.fields.summary,
    href: '/browse/' + item.key,
    containerName: item.fields.project.name,
    objectKey: item.key,
  };
}

function mapConfluenceItemToResultSpace(spaceItem: ConfluenceItem): Result {
  return {
    type: ResultType.Container,
    resultId: 'search-' + spaceItem.container.displayUrl,
    avatarUrl: '', // depends on XPSRCH-747
    name: spaceItem.container.title,
    href: spaceItem.container.displayUrl,
  };
}
