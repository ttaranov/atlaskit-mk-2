import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import {
  SearchResponse,
  CrossProductSearchResults,
  ScopeResult,
  Attributes,
  ABTest,
  SearchQuery,
} from './CrossProductSearchTypesV2';
import { ResultType, AnalyticsType, ContentType } from '../model/Result';

const SEARCH_PATH: string = '/rest/quicksearch/v2';

const JiraTypeToContentType = {
  issue: ContentType.JiraIssue,
  board: ContentType.JiraBoard,
  filter: ContentType.JiraFilter,
  project: ContentType.JiraProject,
};

const extractSpecificAttributes = (attributes: Attributes) => {
  const type = attributes['@type'];
  switch (type) {
    case 'issue':
      return {
        objectKey: attributes.key,
        containerName: attributes.issueTypeName,
      };
    case 'board':
      return {
        objectKey: 'Board',
        containerName: attributes.containerName,
      };
    case 'filter':
      return {
        objectKey: 'Filter',
        containerName: attributes.ownerName,
      };
    case 'project':
      return {
        containerName: attributes.projectType,
      };
  }
  return null;
};

const extractAvatarUrl = ({ url = '', urls = {} } = {}) => {
  if (url) {
    return url;
  }
  return urls['48x48'] || urls[Object.keys(urls)[0]];
};

const extractABTestAttributes = (scopes: ScopeResult[]): ABTest | undefined => {
  const scopeWithABTest = scopes.find(({ abTest }) => !!abTest);
  return scopeWithABTest && scopeWithABTest.abTest;
};

export interface CrossProductSearchClient {
  search(
    query: string,
    scopes: string[],
    searchSessionId: string,
    searchReferrerId?: string,
  ): Promise<CrossProductSearchResults>;
}

export default class CrossProductSearchClientImpl
  implements CrossProductSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  /**
   * @param query string to search for
   * @param searchSessionId string unique for every session id
   * @returns a promise which resolve to search results
   */
  public async search(
    query: string,
    scopes: string[],
    searchSessionId: string,
    searchReferrerId?: string,
  ): Promise<CrossProductSearchResults> {
    const body: SearchQuery = {
      scopes,
      cloudId: this.cloudId,
      searchSession: {
        sessionId: searchSessionId,
        referrerId: searchReferrerId,
      },
      query: {
        string: query,
      },
    };
    const options: RequestServiceOptions = {
      path: SEARCH_PATH,
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    };
    const searchResults = await utils.requestService<SearchResponse>(
      this.serviceConfig,
      options,
    );

    return this.jiraScopesToResults(searchResults.scopes);
  }

  private jiraScopesToResults(
    scopes: ScopeResult[],
  ): CrossProductSearchResults {
    const sections = scopes
      .filter(({ error }) => !error)
      .map(this.scopeToSection);
    const abTest = extractABTestAttributes(scopes);
    return {
      results: sections.reduce(
        (acc, { id, results }) => Object.assign({}, acc, { [id]: results }),
        {},
      ),
      abTest,
    };
  }

  private scopeToSection(scope: ScopeResult) {
    return {
      id: scope.id,
      abTest: scope.abTest,
      results: (scope.results || []).map(({ id, name, url, attributes }) => ({
        resultId: id,
        name: name,
        href: url,
        resultType: ResultType.JiraObjectResult,
        containerId: attributes.containerId,
        analyticsType: AnalyticsType.ResultJira,
        ...extractSpecificAttributes(attributes),
        avatarUrl: attributes.avatar && extractAvatarUrl(attributes.avatar),
        contentType: JiraTypeToContentType[attributes['@type']],
        experimentId: scope.experimentId,
      })),
    };
  }
}
