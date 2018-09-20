import {
  Result,
  PersonResult,
  ResultType,
  AnalyticsType,
} from '../model/Result';
import { mapJiraItemToResult } from './JiraItemMapper';
import { mapConfluenceItemToResult } from './ConfluenceItemMapper';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { Scope, ConfluenceItem, JiraItem, PersonItem } from './types';

export type CrossProductSearchResults = {
  results: Map<Scope, Result[]>;
  experimentId?: string;
  abTest?: ABTest;
};

export const EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE: CrossProductSearchResults = {
  experimentId: '',
  results: new Map(),
};

export interface CrossProductSearchResponse {
  scopes: ScopeResult[];
}

export type SearchItem = ConfluenceItem | JiraItem | PersonItem;

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
    const results: Map<Scope, Result[]> = response.scopes
      .filter(scope => scope.results)
      .reduce((resultsMap, scopeResult) => {
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
      }, new Map());

    return { results, experimentId, abTest };
  }
}

function mapPersonItemToResult(item: PersonItem): PersonResult {
  const mention = item.nickName || item.displayName;

  return {
    resultType: ResultType.PersonResult,
    resultId: 'people-' + item.userId,
    name: item.displayName,
    href: '/people/' + item.userId,
    avatarUrl: item.primaryPhoto,
    analyticsType: AnalyticsType.ResultPerson,
    mentionName: mention,
    presenceMessage: item.title || '',
  };
}

function mapItemToResult(
  scope: Scope,
  item: SearchItem,
  searchSessionId: string,
  experimentId?: string,
): Result {
  if (scope.startsWith('confluence')) {
    return mapConfluenceItemToResult(
      scope,
      item as ConfluenceItem,
      searchSessionId,
      experimentId,
    );
  }
  if (scope.startsWith('jira')) {
    return mapJiraItemToResult(item as JiraItem);
  }

  if (scope === Scope.People) {
    return mapPersonItemToResult(item as PersonItem);
  }

  throw new Error(`Non-exhaustive match for scope: ${scope}`);
}
